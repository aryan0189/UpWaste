const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema({
  wasteId: { type: mongoose.Schema.Types.ObjectId, ref: "Waste" },
  recyclerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quantity: Number,
  status: {
    type: String,
    enum: ["scheduled", "completed"],
    default: "scheduled",
  },
}, { timestamps: true });

module.exports = mongoose.model("Pickup", pickupSchema);
