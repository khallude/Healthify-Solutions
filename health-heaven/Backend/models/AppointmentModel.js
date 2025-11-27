const mongoose = require("mongoose");

// Function to generate a unique 6-digit appointment ID
const generateAppointmentId = async function () {
  let id;
  let exists = true;

  while (exists) {
    id = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit number
    exists = await AppointmentModel.exists({ appointmentId: id });
  }

  return id;
};

const appSchema = new mongoose.Schema(
  {
    appointmentId: { type: Number, unique: true }, // Unique 6-digit ID
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Newuser", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Ddoctor", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Generate and assign a unique 6-digit ID before saving
appSchema.pre("save", async function (next) {
  if (!this.appointmentId) {
    this.appointmentId = await generateAppointmentId();
  }
  next();
});

const AppointmentModel = mongoose.model("AppointmentModel", appSchema);
module.exports = AppointmentModel;
