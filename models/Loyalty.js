// models/Loyalty.js
const mongoose = require("mongoose");

const loyaltySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  history: [
    {
      type: {
        type: String, // "earn" or "redeem"
        required: true,
      },
      points: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Loyalty", loyaltySchema);
