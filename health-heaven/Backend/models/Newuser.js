// const mongoose = require('mongoose');

// const NewuserSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   age: { type: Number, required: true },
//   bloodType: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   allergies: { type: String },
//   chronicConditions: { type: String },
//   profileImage: { type: String }, // Store the URL of the uploaded image
//   password: { type: String, required: true },
//   resetToken: { type: String }, // New field for password reset tokens
//   tokenExpiry: { type: Date }, 
//   status: { type: String, enum: ["Active", "Banned"], default: "Active" }, // New field for token expiry timestamps
// }, { timestamps: true });

// const User = mongoose.model('Newuser', NewuserSchema);

// module.exports = User;

const mongoose = require("mongoose");

// Function to generate a unique 6-digit user ID
const generateUserId = async function () {
  let id;
  let exists = true;

  while (exists) {
    id = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit number
    exists = await User.exists({ userId: id });
  }

  return id;
};

const NewuserSchema = new mongoose.Schema(
  {
    userId: { type: Number, unique: true }, // Unique 6-digit ID
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    bloodType: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    allergies: { type: String },
    chronicConditions: { type: String },
    profileImage: { type: String }, // Store the URL of the uploaded image
    password: { type: String, required: true },
    resetToken: { type: String },
    tokenExpiry: { type: Date },
    status: { type: String, enum: ["Active", "Banned"], default: "Active" },
  },
  { timestamps: true }
);

// Generate and assign a unique 6-digit userId before saving
NewuserSchema.pre("save", async function (next) {
  if (!this.userId) {
    this.userId = await generateUserId();
  }
  next();
});

const User = mongoose.model("Newuser", NewuserSchema);
module.exports = User;

