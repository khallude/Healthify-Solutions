// controllers/medicalRecordController.js
const MedicalRecord = require('../models/MedicalRecord');

exports.createRecord = async (req, res) => {
  try {
    const { recordTitle, description, date, category } = req.body;
    const newRecord = new MedicalRecord({
      recordTitle,
      description,
      date,
      category,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await newRecord.save();
    res.status(201).json({ message: 'Record saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save record' });
  }
};

exports.getAllRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
};
