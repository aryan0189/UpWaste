const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const isAdmin = require("../middleware/isAdmin");
const User = require("../models/User");
const Waste = require("../models/Waste");
const Pickup = require("../models/Pickup");

// Hardcoded or env-based credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@upwaste.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ Admin Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "1d" });
    return res.json({ success: true, token });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// ✅ Admin Stats Route
router.get("/stats", isAdmin, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const waste = await Waste.countDocuments();
    const pickups = await Pickup.countDocuments();

    const completedPickups = await Pickup.find({ status: "completed" }).populate("wasteId");

    let revenue = 0;
    for (let p of completedPickups) {
      const unitPrice = p.wasteId?.price / p.wasteId?.weight || 0;
      revenue += unitPrice * p.quantity;
    }

    res.json({
      users,
      waste,
      pickups,
      revenue: Math.round(revenue),
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Error loading stats" });
  }
});

// 👇 Add this after /stats route
router.get("/users", isAdmin, async (req, res) => {
    try {
      const users = await User.find().select("-password"); // exclude password
      res.json(users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  router.get("/pickups", isAdmin, async (req, res) => {
    try {
      const pickups = await Pickup.find()
        .populate({
          path: "wasteId",
          populate: { path: "postedBy", model: "User" } // <-- Seller (generator)
        })
        .populate("recyclerId"); // <-- Buyer (recycler)
  
      res.json(pickups);
    } catch (err) {
      console.error("Admin pickups error:", err);
      res.status(500).json({ message: "Error loading pickups" });
    }
  });

  // DELETE /api/admin/pickups/:id
router.delete("/pickups/:id", isAdmin, async (req, res) => {
    try {
      await Pickup.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: "Pickup deleted" });
    } catch (err) {
      console.error("Delete pickup error:", err);
      res.status(500).json({ success: false, message: "Error deleting pickup" });
    }
  });
  
  

module.exports = router;
