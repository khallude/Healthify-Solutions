const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, 'Email is not valid'],
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
  doctorImage: {
    type: String,  // Add a new field for the doctor's image URL
    required: false,  // Make it optional or set it as required as needed
  },
  status: {
    type: String,
    default: 'Pending', // Can be "Confirmed", "Cancelled"
  },
});

// Pre-save hook to combine date and time into a single Date object
appointmentSchema.pre('save', function(next) {
  const time = this.time;
  const date = new Date(this.date);

  // Combine the date with the entered time (AM/PM handling)
  const [hour, minute, period] = time.split(/[:\s]/);
  date.setHours(period === 'AM' ? hour : parseInt(hour) + 12, minute);

  this.date = date; // Set the combined date back to the document
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
