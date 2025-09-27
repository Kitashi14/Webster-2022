/** @format */

const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");
const logger = require("../utils/logger");

// Test endpoint to verify server is working
router.get(
  "/test",
  asyncHandler(async (req, res) => {
    logger.info("Test endpoint hit");
    res.status(200).json({
      success: true,
      message: "Backend server is working!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  })
);

// Health check endpoint
router.get(
  "/health",
  asyncHandler(async (req, res) => {
    const mongoose = require("mongoose");

    const health = {
      status: "OK",
      timestamp: new Date().toISOString(),
      services: {
        database:
          mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        email: process.env.EMAIL_NODEMAILER ? "Configured" : "Not configured",
      },
    };

    res.status(200).json(health);
  })
);

module.exports = router;
