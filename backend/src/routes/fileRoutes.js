const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const upload = require(
  "../config/multer"
);

const {
  uploadFile,
  getFiles,
  deleteFile,
} = require(
  "../controllers/fileController"
);

router.post(
  "/upload",
  protect,
  upload.single("file"),
  uploadFile
);

router.get(
  "/:teamId",
  protect,
  getFiles
);

router.delete(
  "/:id",
  protect,
  deleteFile
);

module.exports = router;