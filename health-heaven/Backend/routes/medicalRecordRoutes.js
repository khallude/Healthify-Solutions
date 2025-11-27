// routes/medicalRecordRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { createRecord, getAllRecords } = require('../Controller/medicalRecordController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Define routes
router.post('/records', upload.single('file'), createRecord);
router.get('/records', getAllRecords);

module.exports = router;
