const express = require("express");
const router = express.Router();
const Waste = require("../models/Waste");

// ✅ GET all waste listings
router.get("/", async (req, res) => {
  try {
    const waste = await Waste.find().sort({ createdAt: -1 });
    res.json(waste);
  } catch (err) {
    console.error("GET /waste error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET single waste by ID
router.get("/:id", async (req, res) => {
  try {
    const waste = await Waste.findById(req.params.id);
    if (!waste) {
      return res.status(404).json({ message: "Waste not found" });
    }
    res.json(waste);
  } catch (err) {
    console.error("GET /waste/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST new waste listing
router.post("/", async (req, res) => {
  try {
    const newWaste = new Waste(req.body);
    await newWaste.save();
    res.status(201).json(newWaste);
  } catch (err) {
    console.error("POST /waste error:", err);
    res.status(500).json({ message: "Failed to create listing" });
  }
});

// ✅ PUT update listing
router.put("/:id", async (req, res) => {
  try {
    const updated = await Waste.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// ✅ DELETE a listing
router.delete("/:id", async (req, res) => {
  try {
    await Waste.findByIdAndDelete(req.params.id);
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});
// Get all waste listings by a generator
router.get("/generator/:id", async (req, res) => {
    try {
      const listings = await Waste.find({ generatorId: req.params.id });
      res.json(listings);
    } catch (err) {
      console.error("Error fetching generator listings:", err);
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  });
  
module.exports = router;
