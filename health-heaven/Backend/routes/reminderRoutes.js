const express = require('express');
const { authenticate } = require('../../Backend/middlewares/auth');
const { createReminder } = require('../Controller/reminderController');

const router = express.Router();

// Apply authentication middleware before calling createReminder
router.post('/reminders', authenticate, (req, res) => {
  console.log("POST request to /api/reminders received");
  createReminder(req, res); // Calls the controller function to handle the reminder creation
});

module.exports = router;
