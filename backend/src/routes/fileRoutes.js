const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../config/multer");

const {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
} = require("../controllers/fileController");

// Use query parameters `?teamId=...` or `?meetingId=...`
router.get("/", protect, getFiles);

// New secure download route
router.get("/download/:id", protect, downloadFile);

router.post("/upload", protect, upload.single("file"), uploadFile);

router.delete("/:id", protect, deleteFile);

module.exports = router;