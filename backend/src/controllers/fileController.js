const File = require("../models/File");

const uploadFile = async (
  req,
  res
) => {
  try {
    const { teamId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const file = await File.create({
      teamId,
      uploadedBy: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getFiles = async (
  req,
  res
) => {
  try {
    const files =
      await File.find({
        teamId: req.params.teamId,
      })
        .populate(
          "uploadedBy",
          "username email"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteFile = async (
  req,
  res
) => {
  try {
    const file =
      await File.findById(
        req.params.id
      );

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    await file.deleteOne();

    res.status(200).json({
      message:
        "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  deleteFile,
};