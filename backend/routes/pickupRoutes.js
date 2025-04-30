// const express = require("express");
// const router = express.Router();
// const Pickup = require("../models/Pickup");
// const Waste = require("../models/Waste");



// router.post("/", async (req, res) => {
//     try {
//       const { wasteId, recyclerId, quantity } = req.body;
  
//       // 1. Find waste
//       const waste = await Waste.findById(wasteId);
//       if (!waste) return res.status(404).json({ message: "Waste item not found" });
  
//       // 2. Check available quantity
//       if (waste.weight < quantity) {
//         return res.status(400).json({ message: "Not enough quantity available" });
//       }
  
//       // 3. Create pickup
//       const pickup = new Pickup({ wasteId, recyclerId, quantity });
//       await pickup.save();
  
//       // 4. Update waste weight
//       waste.weight -= quantity;
//       if (waste.weight <= 0) {
//         waste.status = "sold";
//         waste.weight = 0;
//       }
//       await waste.save();
  
//       res.status(201).json({ pickup, updatedWaste: waste });
//     } catch (err) {
//       console.error("Pickup creation failed:", err);
//       res.status(500).json({ message: "Error creating pickup" });
//     }
//   });
  
// // Create new pickup request
// router.post("/", async (req, res) => {
//   try {
//     const { wasteId, recyclerId, quantity } = req.body;
//     const pickup = new Pickup({ wasteId, recyclerId, quantity });
//     await pickup.save();
//     res.status(201).json(pickup);
//   } catch (err) {
//     console.error("Pickup creation failed:", err);
//     res.status(500).json({ message: "Error creating pickup" });
//   }
// });

// // Get all scheduled pickups for a recycler
// router.get("/scheduled/:recyclerId", async (req, res) => {
//   try {
//     const pickups = await Pickup.find({
//       recyclerId: req.params.recyclerId,
//       status: "scheduled",
//     }).populate("wasteId");

//     res.json(pickups);
//   } catch (err) {
//     console.error("Error fetching scheduled pickups:", err);
//     res.status(500).json({ message: "Failed to fetch scheduled pickups" });
//   }
// });

// // Get all completed pickups for a recycler
// router.get("/completed/:recyclerId", async (req, res) => {
//   try {
//     const pickups = await Pickup.find({
//       recyclerId: req.params.recyclerId,
//       status: "completed",
//     }).populate("wasteId");

//     res.json(pickups);
//   } catch (err) {
//     console.error("Error fetching completed pickups:", err);
//     res.status(500).json({ message: "Failed to fetch completed pickups" });
//   }
// });

// // Mark a pickup as completed
// router.put("/complete/:id", async (req, res) => {
//   try {
//     const pickup = await Pickup.findById(req.params.id);
//     if (!pickup) return res.status(404).json({ message: "Pickup not found" });

//     pickup.status = "completed";
//     await pickup.save();

//     res.json({ message: "Pickup marked as completed", pickup });
//   } catch (err) {
//     console.error("Error completing pickup:", err);
//     res.status(500).json({ message: "Failed to complete pickup" });
//   }
// });

// // Get pickup stats for recycler
// router.get("/stats/:recyclerId", async (req, res) => {
//   try {
//     const recyclerId = req.params.recyclerId;
//     const pickups = await Pickup.find({ recyclerId }).populate("wasteId");

//     let totalSpent = 0;
//     let scheduled = 0;
//     let completed = 0;

//     pickups.forEach((pickup) => {
//       const unitPrice = pickup.wasteId?.price / pickup.wasteId?.weight || 0;
//       const cost = Math.round(unitPrice * pickup.quantity);
//       if (pickup.status === "completed") totalSpent += cost;
//       if (pickup.status === "scheduled") scheduled++;
//       if (pickup.status === "completed") completed++;
//     });

//     res.json({ totalSpent, scheduled, completed });
//   } catch (err) {
//     console.error("Stats error:", err);
//     res.status(500).json({ message: "Failed to fetch pickup stats" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Pickup = require("../models/Pickup");
const Waste = require("../models/Waste");

// Create new pickup request and update waste quantity
router.post("/", async (req, res) => {
  try {
    const { wasteId, recyclerId, quantity } = req.body;

    const waste = await Waste.findById(wasteId);
    if (!waste) return res.status(404).json({ message: "Waste item not found" });

    if (waste.weight < quantity) {
      return res.status(400).json({ message: "Not enough quantity available" });
    }

    const pickup = new Pickup({ wasteId, recyclerId, quantity });
    await pickup.save();

    waste.weight -= quantity;
    if (waste.weight <= 0) {
      waste.status = "sold";
      waste.weight = 0;
    }
    await waste.save();

    res.status(201).json({ pickup, updatedWaste: waste });
  } catch (err) {
    console.error("Pickup creation failed:", err);
    res.status(500).json({ message: "Error creating pickup" });
  }
});

// Get all scheduled pickups for a recycler
router.get("/scheduled/:recyclerId", async (req, res) => {
  try {
    const pickups = await Pickup.find({
      recyclerId: req.params.recyclerId,
      status: "scheduled",
    }).populate("wasteId");

    res.json(pickups);
  } catch (err) {
    console.error("Error fetching scheduled pickups:", err);
    res.status(500).json({ message: "Failed to fetch scheduled pickups" });
  }
});

// Mark a pickup as completed
router.put("/complete/:id", async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) return res.status(404).json({ message: "Pickup not found" });

    pickup.status = "completed";
    await pickup.save();

    res.json({ message: "Pickup marked as completed", pickup });
  } catch (err) {
    console.error("Error completing pickup:", err);
    res.status(500).json({ message: "Failed to complete pickup" });
  }
});

// Get all completed pickups for a recycler
router.get("/completed/:recyclerId", async (req, res) => {
  try {
    const pickups = await Pickup.find({
      recyclerId: req.params.recyclerId,
      status: "completed",
    }).populate("wasteId");

    res.json(pickups);
  } catch (err) {
    console.error("Error fetching completed pickups:", err);
    res.status(500).json({ message: "Failed to fetch completed pickups" });
  }
});

// Get pickup stats for recycler dashboard
router.get("/stats/:recyclerId", async (req, res) => {
  try {
    const recyclerId = req.params.recyclerId;
    const pickups = await Pickup.find({ recyclerId }).populate("wasteId");

    let totalSpent = 0;
    let scheduled = 0;
    let completed = 0;

    pickups.forEach((pickup) => {
      const unitPrice = pickup.wasteId?.price / pickup.wasteId?.weight || 0;
      const cost = Math.round(unitPrice * pickup.quantity);
      if (pickup.status === "completed") totalSpent += cost;
      if (pickup.status === "scheduled") scheduled++;
      if (pickup.status === "completed") completed++;
    });

    res.json({ totalSpent, scheduled, completed });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Failed to fetch pickup stats" });
  }
});

// Get all pickups related to a generator's waste listings
router.get("/from-generator/:generatorId", async (req, res) => {
  try {
    const pickups = await Pickup.find().populate("wasteId");
    const filtered = pickups.filter(p => {
      const genId = p.wasteId?.generatorId || p.wasteId?.postedBy;
      return genId == req.params.generatorId || genId?._id == req.params.generatorId;
    });
    res.json(filtered);
  } catch (err) {
    console.error("Error fetching pickups by generator:", err);
    res.status(500).json({ message: "Failed to fetch pickups" });
  }
});

module.exports = router;
