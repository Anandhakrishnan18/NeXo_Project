const File = require("../models/File");
const fs = require("fs");
const path = require("path");
const Team = require("../models/Team");
const Meeting = require("../models/Meeting");
const { createNotification } = require("../utils/notifications");

const uploadFile = async (req, res) => {
  try {
    const { teamId, meetingId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!teamId && !meetingId) {
      // Clean up uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Either teamId or meetingId is required" });
    }

    const fileData = {
      uploadedBy: req.user.id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      filePath: req.file.path,
    };

    if (teamId) fileData.teamId = teamId;
    if (meetingId) fileData.meetingId = meetingId;

    const file = await File.create(fileData);
    
    // Populate uploadedBy so the frontend instantly has username
    await file.populate("uploadedBy", "username email");

    // Emit Socket.io event globally so clients can listen and filter
    const io = req.app.get("io");
    if (io) {
      io.emit("file-uploaded", file);
    }

    // Notify other team members if uploaded to a team
    if (teamId) {
      const team = await Team.findById(teamId);
      if (team) {
        team.members.forEach((memberId) => {
          if (memberId.toString() !== req.user.id) {
            createNotification(
              req,
              memberId,
              "New File Shared",
              `${req.user.username} uploaded a new file "${req.file.originalname}" in team "${team.name}"`
            );
          }
        });
      }
    }

    res.status(201).json(file);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

const getFiles = async (req, res) => {
  try {
    const { teamId, meetingId } = req.query;

    if (!teamId && !meetingId) {
      return res.status(400).json({ message: "Either teamId or meetingId query parameter is required" });
    }

    const query = {};
    if (teamId) query.teamId = teamId;
    if (meetingId) query.meetingId = meetingId;

    const files = await File.find(query)
      .populate("uploadedBy", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Absolute path resolution
    const absolutePath = path.resolve(file.filePath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "Physical file is missing from server" });
    }

    // Download the file with its original name
    res.download(absolutePath, file.originalName, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        // Do not send another response if headers already sent
        if (!res.headersSent) {
          res.status(500).json({ message: "Error streaming the file" });
        }
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Physically delete file from disk if it exists
    if (file.filePath && fs.existsSync(file.filePath)) {
      try {
        fs.unlinkSync(file.filePath);
      } catch (err) {
        console.error("Failed to delete physical file from disk:", err);
      }
    }

    await file.deleteOne();

    const io = req.app.get("io");
    if (io) {
      io.emit("file-deleted", file._id);
    }

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
};