const mongoose = require("mongoose");

const wasteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    image: String,
    category: { type: String, required: true },
    location: String,
    weight: Number, // ✅ new
    price: Number,  // ✅ new
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
        type: String,
        enum: ["available", "sold"],
        default: "available"
      }
  }, { timestamps: true });
module.exports = mongoose.model("Waste", wasteSchema);
