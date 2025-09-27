/** @format */

// Load environment variables first
require("dotenv").config();

// Validate environment variables
const validateEnv = require("./utils/validateEnv");
const env = validateEnv();

// Import modules
const express = require("express");
const { createServer } = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const mongoose = require("mongoose");

// Import utilities and middleware
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const { startSocket } = require("./socket");

// Import routers
const authRouters = require("./routers/auth-routers");
const userRouters = require("./routers/user-routers");
const complainRouters = require("./routers/complain-routers");
const workerRouters = require("./routers/worker-routers");
const testRouters = require("./routers/test-routers");

// Create Express app and HTTP server
const app = express();
const httpServer = createServer(app);

// Initialize socket
startSocket(httpServer);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: env.UI_ROOT_URI,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// Static files
app.use(express.static("public"));

// Database connection
mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    // Use MONGODB_URI from env if provided, otherwise construct from individual vars
    let mongoUri;

    if (process.env.MONGODB_URI) {
      mongoUri = process.env.MONGODB_URI;
    } else {
      // Fallback to local MongoDB for development
      mongoUri = `mongodb://localhost:27017/${env.DBNAME}`;
      logger.warn(
        "Using local MongoDB for development. Set MONGODB_URI for production."
      );
    }

    const conn = await mongoose.connect(mongoUri);

    logger.info(
      `MongoDB Connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`
    );
  } catch (error) {
    logger.error("Database connection error:", error);

    // Don't exit in development, just log the error
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      logger.warn("Continuing without database connection in development mode");
    }
  }
};

// Connect to database
connectDB();

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRouters);
app.use("/api/user", userRouters);
app.use("/api/complain", complainRouters);
app.use("/api/worker", workerRouters);
app.use("/api/test", testRouters);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info("Received shutdown signal, shutting down gracefully");
  httpServer.close(() => {
    logger.info("Process terminated");
    mongoose.connection.close();
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Start server
const port = env.PORT || 5000;
httpServer.listen(port, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${port}`);
});
