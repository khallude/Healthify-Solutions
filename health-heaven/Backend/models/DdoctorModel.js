// const mongoose = require("mongoose");

// const DdoctorSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   fees: { type: Number, required: true },
//   location: { type: String, required: true },
//   specialty: { type: String, required: true },
//   experience: { type: Number, required: true },
//   hospitalAffiliation: { type: String },
//   certificateUrl: { type: String },
//   govIDUrl: { type: String },
//   profilePictureUrl: { type: String },
//   status: { type: String, enum: ["Pending", "Approved", "Rejected", "Banned"], default: "Pending" },
  
// });



// module.exports = mongoose.model("Ddoctor", DdoctorSchema);

const mongoose = require("mongoose");

const DdoctorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fees: { type: Number, required: true },
    location: { type: String, required: true },
    specialty: { type: String, required: true },
    experience: { type: Number, required: true },
    hospitalAffiliation: { type: String },
    certificateUrl: { type: String },
    govIDUrl: { type: String },
    profilePictureUrl: { type: String },
    // profilePictureUrl: { type: String },
    status: { 
      type: String, 
      enum: ["Pending", "Approved", "Rejected", "Banned"], 
      default: "Pending" 
    },

     // New Fields
  workingDays: { 
    type: [String], 
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] 
  }, 
  workingHours: {
    startTime: { type: String }, // e.g., "09:00 AM"
    endTime: { type: String } // e.g., "05:00 PM"
  },
  lunchBreak: { 
    type: String, 
    enum: ["12:00-12:30", "12:30-1:00", "1:00-1:30"], 
    default: "12:30-1:00" 
  },
  },
  { timestamps: true } // ✅ Adds createdAt & updatedAt fields automatically
);

module.exports = mongoose.model("Ddoctor", DdoctorSchema);