const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure the doctors directory exists
const doctorsDir = path.join(__dirname, '../uploads/doctors');
if (!fs.existsSync(doctorsDir)) {
  fs.mkdirSync(doctorsDir, { recursive: true });
}

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, doctorsDir); // Store files in the 'uploadss/doctors' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Generate a unique file name
  },
});

// Initialize multer with the updated storage configuration
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;
