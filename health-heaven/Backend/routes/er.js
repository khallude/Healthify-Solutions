const express = require('express');
const { addDoctor, deleteDoctor, getDoctors, updateDoctor } = require('../Controller/adminController');
const { isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

const router = express.Router();

// Admin routes with file upload middleware
router.post('/doctors', isAdmin, upload.single('imageFile'), addDoctor); // Add a doctor
router.put('/doctors/:id', isAdmin, upload.single('imageFile'), updateDoctor); // Update a doctor
router.get('/doctors', isAdmin, getDoctors); // Get all doctors
router.delete('/doctors/:id', isAdmin, deleteDoctor); // Delete a doctor

module.exports = router;