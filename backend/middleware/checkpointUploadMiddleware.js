// backend/middleware/checkpointUploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/checkpoints/';

// Ensure the upload directory exists
fs.mkdirSync(uploadDir, { recursive: true });

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // The folder where files will be stored
  },
  filename: function (req, file, cb) {
    // Create a unique filename to prevent overwrites
    cb(null, `checkpoint-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Check if the uploaded file is an image
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Images Only!'));
  }
}

const checkpointUpload = multer({
  storage,
  fileFilter: (req, file, cb) => checkFileType(file, cb),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
}).single('image'); // 'image' is the name of the form field on the frontend

module.exports = checkpointUpload;
