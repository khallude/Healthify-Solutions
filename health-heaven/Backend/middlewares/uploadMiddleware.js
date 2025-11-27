const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the base directory where files will be stored
const uploadDir = process.env.UPLOAD_DIR || "./uploads";

// Utility function to check and create directories
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // Create the directory if it doesn't exist
  }
};

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";

    // Determine which directory to use based on the field name
    if (file.fieldname === "userImage") {
      folder = path.resolve(uploadDir, "users");
    } else if (file.fieldname === "doctorImage") {
      folder = path.resolve(uploadDir, "doctors");
    } else if (file.fieldname === "adminImage") {      
      folder = path.resolve(uploadDir, "admins");
    }

    // Ensure the folder exists
    ensureDirExists(folder);

    // Set the destination folder
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Set the filename to be unique
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to only accept specific file types (images)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG and PNG files are allowed."));
  }
};

// Create the multer instance with the storage configuration and file filter
const upload = multer({ storage, fileFilter });

// Export the multer instance
module.exports = upload;
