const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  recurrence: { type: String, enum: ['None', 'Daily', 'Weekly', 'Monthly', 'Custom'], default: 'None' },
  notifications: {
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
  },
  message: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Newuser', required: true },
  sent: { type: Boolean, default: false }, // Field to track if the reminder has been sent
});

const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = Reminder;
