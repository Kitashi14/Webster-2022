const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = async (req, res, next) => {
  console.log("\nAdmin auth middleware hit");

  let login_token;
  try {
    login_token = req.cookies[process.env.LOGIN_COOKIE_NAME];
    if (!login_token) {
      throw new Error("Authentication failed: Session expired.");
    }
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed. Please login." });
  }

  try {
    const decoded_token = jwt.verify(login_token, process.env.JWT_SECRET);
    const user = await User.findOne({ userName: decoded_token.userName });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    req.userData = { userId: user._id, userName: user.userName, role: user.role };
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({ error: "Authentication failed." });
  }
};

module.exports = adminAuth;
