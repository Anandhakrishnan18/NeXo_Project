const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Allow specific mime types and extensions
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
    "application/zip",
    "application/x-zip-compressed",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "video/mp4",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOCX, PPTX, XLSX, ZIP, PNG, JPG, and MP4 are allowed."));
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});