const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    company: String,
    position: String,
    status: {
      type: String,
      enum: ["applied", "interview", "offer", "rejected"],
      default: "applied"
    },
    notes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);