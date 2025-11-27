// models/MedicalRecord.js
const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  recordTitle: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  category: { type: String, required: true },
  fileUrl: String,
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
