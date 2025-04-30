const jwt = require("jsonwebtoken");

const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "admin") {
      req.admin = decoded;
      next();
    } else {
      return res.status(403).json({ message: "Forbidden: Not an admin" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = isAdmin;
