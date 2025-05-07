const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
const app = express();
app.use(express.json());

app.use(cors());

app.use(morgan("dev"));


const authRoutes = require("./routes/authRoutes");





const adminRoutes = require("./routes/adminRoutes");

// Be sure express.json() is already added above this
app.use("/api/admin", adminRoutes);



app.use("/api/auth", authRoutes);

const wasteRoutes = require("./routes/wasteRoutes");
app.use("/api/waste", wasteRoutes);

const pickupRoutes = require("./routes/pickupRoutes");
app.use("/api/pickup", pickupRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

  })
  .catch((err) => console.log(err));
