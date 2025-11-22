// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // The folder where files will be stored
  },
  filename: function (req, file, cb) {
    // Create a unique filename to prevent overwrites
    cb(null, `submission-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Check if the uploaded file is an image
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi|wmv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Images or Videos Only!'));
  }
}

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => checkFileType(file, cb),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
}).single('image'); // 'image' is the name of the form field on the frontend

module.exports = upload;