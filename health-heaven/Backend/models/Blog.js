const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ddoctor", // ✅ Ensuring reference to the correct model
      required: true,
    },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    details: { type: String, required: true },
    thumbnail: { type: String, required: true }, // ✅ Cloudinary thumbnail URL
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Newuser" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Newuser" },
        text: { type: String},
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);

