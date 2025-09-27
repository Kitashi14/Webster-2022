/** @format */

//querystring used for formatting in url-encoded form
const querystring = require("querystring");

//axios for sending api requests
const axios = require("axios");

//nodemailer for sending otp
const nodemailer = require("nodemailer");

// Logger and error handling
const logger = require("../utils/logger");
const asyncHandler = require("../middleware/asyncHandler");

// create reusable transporter object using the default SMTP transport
let transporter;

if (process.env.EMAIL_MODE === "development") {
  // Use a simple transport for development (won't actually send emails)
  transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: "unix",
    buffer: true,
  });
} else {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_NODEMAILER,
      pass: process.env.PASSWORD_NODEMAILER,
    },
    port: 465,
    host: "smtp.gmail.com",
  });
}

//for creating-checking jwt token
const jwt = require("jsonwebtoken");

//for hashing password
const bcrypt = require("bcryptjs");

//importing function and Token modal
const { getUserInfo } = require("./user-controllers");
const Token = require("../models/token");

const redirectURI = process.env.GOOGLE_AUTH_REDIRECT_URI;

//for getting url of google authentication page
const googleAuthPage = asyncHandler(async (req, res, next) => {
  logger.info("Google auth page request received");

  // Validate required environment variables
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.SERVER_ROOT_URI) {
    logger.error("Missing Google OAuth configuration");
    return res.status(500).json({
      success: false,
      error: "Google authentication not configured properly",
    });
  }

  //return google auth link
  function getGoogleAuthURL() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
      client_id: process.env.GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };

    return `${rootUrl}?${querystring.stringify(options)}`;
  }

  logger.info("Sending Google auth URL");
  return res.status(200).json({
    success: true,
    url: getGoogleAuthURL(),
  });
});

//fetching google user data (for login and creating account)
const redirectGoogleEmail = asyncHandler(async (req, res, next) => {
  logger.info("Google OAuth redirect received");

  //code of user got after redirecting google auth page
  const code = req.query.code;

  if (!code) {
    logger.error("No authorization code received from Google");
    return res.redirect(`${process.env.UI_ROOT_URI}/login?error=auth_failed`);
  }

  // Validate required environment variables
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    logger.error("Missing GOOGLE_CLIENT_SECRET environment variable");
    return res.redirect(`${process.env.UI_ROOT_URI}/login?error=config_error`);
  }

  try {
    // Function to exchange authorization code for tokens
    const getTokens = async ({ code, clientId, clientSecret, redirectUri }) => {
      const url = "https://oauth2.googleapis.com/token";
      const values = {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      };

      try {
        const response = await axios.post(url, querystring.stringify(values), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        logger.info("Successfully obtained Google OAuth tokens");
        return response.data;
      } catch (error) {
        logger.error("Failed to exchange authorization code for tokens:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        throw new Error("Failed to get access tokens from Google");
      }
    };

    const { id_token, access_token } = await getTokens({
      code,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
    });

    if (!access_token) {
      throw new Error("No access token received from Google");
    }

    // Fetch the user's profile using Google's userinfo endpoint
    const googleUser = await axios
      .get(`https://www.googleapis.com/oauth2/v2/userinfo`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => {
        logger.info("Successfully fetched user data from Google");
        return res.data;
      })
      .catch((error) => {
        logger.error("Failed to fetch user data from Google:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        throw new Error("Failed to get user data from Google");
      });

    // Validate required user data from Google
    if (!googleUser.email) {
      logger.error("No email received from Google user data");
      return res.redirect(`${process.env.UI_ROOT_URI}/login?error=no_email`);
    }

    logger.info(`Processing Google OAuth for user: ${googleUser.email}`);

    //check if a user exist with this google email
    const existingUser = await getUserInfo(googleUser.email);

    //if doesn't exist then redirect to create account page
    if (!existingUser) {
      logger.info(
        "New user from Google OAuth, redirecting to account creation"
      );

      const userData = {
        userEmail: googleUser.email,
        isVerified: googleUser.verified_email || true, // Google emails are verified
        isGoogleVerified: true,
      };

      //creating jwt token
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      //sending cookies to client side
      res.cookie(process.env.EMAIL_COOKIE_NAME, token, {
        expires: new Date(Date.now() + 60 * 60 * 1000), //1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      logger.info("Redirecting to create account page with email token");
      return res.redirect(`${process.env.UI_ROOT_URI}/createAccount`);
    }

    //if exist then redirect to home page with login
    else {
      logger.info(
        `Existing user logged in via Google: ${existingUser.username}`
      );

      const userData = {
        id: existingUser._id,
        userEmail: existingUser.email,
        userName: existingUser.username,
      };

      //creating jwt token
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "10d",
      });

      //sending cookies to client side
      res.cookie(process.env.LOGIN_COOKIE_NAME, token, {
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      logger.info("Redirecting to home page with login token");
      return res.redirect(`${process.env.UI_ROOT_URI}`);
    }
  } catch (err) {
    logger.error("Google Authentication error:", {
      message: err.message,
      stack: err.stack,
    });

    return res.redirect(`${process.env.UI_ROOT_URI}/login?error=auth_failed`);
  }
});

//create otp-token for adding user and updating user-password
const createOtp = asyncHandler(async (req, res, next) => {
  logger.info("OTP request received", { email: req.body.email });

  const { email, createAccount: isCreatingAccount } = req.body;

  // Validate input
  if (!email) {
    return res.status(400).json({
      success: false,
      error: "Email is required",
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format",
    });
  }

  // Validate email configuration
  if (!process.env.EMAIL_NODEMAILER || !process.env.PASSWORD_NODEMAILER) {
    logger.error("Email configuration missing");
    return res.status(500).json({
      success: false,
      error: "Email service not configured",
    });
  }

  try {
    let existingUser = null;

    // In development mode, skip database checks
    if (process.env.DATABASE_MODE !== "development") {
      // Check if user exists
      existingUser = await getUserInfo(email);

      if (isCreatingAccount) {
        // For account creation - user should not exist
        if (existingUser) {
          logger.warn(`Account creation attempted for existing user: ${email}`);
          return res.status(400).json({
            success: false,
            error: "Email already in use",
          });
        }
        logger.info("New user signup, generating OTP");
      } else {
        // For password reset - user should exist
        if (!existingUser) {
          logger.warn(
            `Password reset attempted for non-existent user: ${email}`
          );
          return res.status(400).json({
            success: false,
            error: "No user exists with this email",
          });
        }
        logger.info("Password reset request, generating OTP");
      }
    } else {
      // Development mode - simulate user existence for testing
      logger.info("Development mode: Skipping database user check");
      if (isCreatingAccount) {
        logger.info("New user signup in development mode");
      } else {
        logger.info("Password reset request in development mode");
      }
    }

    // Create user data for JWT
    const userData = {
      userEmail: email,
      isVerified: false,
      isGoogleVerified: false,
      isCreatingAccount: isCreatingAccount,
    };

    // Create JWT token with expiration
    const token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set secure cookie
    res.cookie(process.env.EMAIL_COOKIE_NAME, token, {
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Generate 4-digit OTP
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    logger.info("OTP generated for email", { email });

    // Hash OTP before storing
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    if (process.env.DATABASE_MODE !== "development") {
      // Remove any existing OTP tokens for this email
      await Token.deleteMany({ email: email });
      logger.info("Cleared existing OTP tokens", { email });

      // Create new OTP token
      const newToken = new Token({
        email: email,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
      });

      await newToken.save();
      logger.info("OTP token saved to database", { email });
    } else {
      // Development mode - just log the token info
      logger.info("Development mode: OTP token would be saved", {
        email,
        hashedLength: hashedOTP.length,
        expiresIn: "1 hour",
      });
    }

    // Prepare email content
    const subject = isCreatingAccount
      ? "Verification for Webster Account"
      : "Password Reset Verification";

    const emailContent = isCreatingAccount
      ? `<p>Enter <b>${otp}</b> to verify your email and create your account.</p><p>This code <b>expires in 1 hour.</b></p>`
      : `<p>Enter <b>${otp}</b> to verify your email and reset your password.</p><p>This code <b>expires in 1 hour.</b></p>`;

    // Send email using promise-based approach
    try {
      if (process.env.EMAIL_MODE === "development") {
        // In development mode, just log the OTP instead of sending email
        logger.info("📧 DEVELOPMENT MODE - OTP Email", {
          email,
          otp: otp,
          subject: subject,
          message: "Check console for OTP (not sent via email in development)",
        });

        console.log(`\n🔐 OTP FOR ${email}: ${otp}\n`);
      } else {
        await transporter.sendMail({
          from: process.env.EMAIL_NODEMAILER,
          to: email,
          subject: subject,
          html: emailContent,
        });

        logger.info("OTP email sent successfully", { email });
      }

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (emailError) {
      logger.error("Failed to send OTP email:", {
        error: emailError.message,
        email: email,
      });

      // Clean up the saved token since email failed
      if (process.env.DATABASE_MODE !== "development") {
        await Token.deleteMany({ email: email });
      }

      return res.status(500).json({
        success: false,
        error: "Failed to send OTP email. Please try again.",
      });
    }
  } catch (err) {
    logger.error("Error in createOtp:", {
      error: err.message,
      email: email,
      stack: err.stack,
    });

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Verify OTP function
const verifyOpt = asyncHandler(async (req, res, next) => {
  logger.info("OTP verification request received", {
    email: req.body.email,
    hasOtp: !!req.body.otp,
  });

  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      error: "Email and OTP are required",
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format",
    });
  }

  // Validate OTP format (4 digits)
  const otpRegex = /^\d{4}$/;
  if (!otpRegex.test(otp)) {
    return res.status(400).json({
      success: false,
      error: "Invalid OTP format. Must be 4 digits.",
    });
  }

  try {
    let tokenRecord = null;

    if (process.env.DATABASE_MODE !== "development") {
      // Find the OTP token in database
      tokenRecord = await Token.findOne({ email: email });

      if (!tokenRecord) {
        logger.warn(
          `OTP verification attempted for non-existent token: ${email}`
        );
        return res.status(400).json({
          success: false,
          error: "Invalid or expired OTP",
        });
      }

      // Check if token has expired
      if (Date.now() > tokenRecord.expiresAt) {
        logger.warn(`Expired OTP verification attempted: ${email}`);
        // Clean up expired token
        await Token.deleteMany({ email: email });
        return res.status(400).json({
          success: false,
          error: "OTP has expired. Please request a new one.",
        });
      }

      // Verify OTP
      const isValidOTP = await bcrypt.compare(otp, tokenRecord.otp);
      if (!isValidOTP) {
        logger.warn(`Invalid OTP verification attempted: ${email}`);
        return res.status(400).json({
          success: false,
          error: "Invalid OTP",
        });
      }

      // OTP is valid, clean up the token
      await Token.deleteMany({ email: email });
      logger.info("OTP verified successfully and token cleaned up", { email });
    } else {
      // Development mode - accept any 4-digit OTP
      logger.info("Development mode: OTP verification bypassed", {
        email,
        otp,
      });
    }

    // Get user token from cookie to understand the context
    const emailToken = req.cookies[process.env.EMAIL_COOKIE_NAME];
    let userData = null;

    if (emailToken) {
      try {
        userData = jwt.verify(emailToken, process.env.JWT_SECRET);
        logger.info("Retrieved user data from cookie", {
          email: userData.userEmail,
          isCreatingAccount: userData.isCreatingAccount,
        });
      } catch (jwtError) {
        logger.error("Invalid JWT token in cookie:", jwtError.message);
      }
    }

    // Clear the email verification cookie
    res.clearCookie(process.env.EMAIL_COOKIE_NAME);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: {
        email: email,
        isVerified: true,
        isCreatingAccount: userData?.isCreatingAccount || false,
        nextStep: userData?.isCreatingAccount
          ? "Complete account creation"
          : "Password reset available",
      },
    });
  } catch (err) {
    logger.error("Error in verifyOtp:", {
      error: err.message,
      email: email,
      stack: err.stack,
    });

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Verify user login (email/password)
const verifyUser = asyncHandler(async (req, res, next) => {
  logger.info("User login verification request received", {
    email: req.body.email,
    hasPassword: !!req.body.password,
  });

  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required",
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format",
    });
  }

  try {
    let user = null;

    if (process.env.DATABASE_MODE !== "development") {
      // Find user in database
      user = await getUserInfo(email);

      if (!user) {
        logger.warn(`Login attempted for non-existent user: ${email}`);
        return res.status(400).json({
          success: false,
          error: "Invalid email or password",
        });
      }

      // Check if user is verified
      if (!user.isVerified) {
        logger.warn(`Login attempted for unverified user: ${email}`);
        return res.status(400).json({
          success: false,
          error: "Email not verified. Please verify your email first.",
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        logger.warn(`Invalid password for user: ${email}`);
        return res.status(400).json({
          success: false,
          error: "Invalid email or password",
        });
      }

      logger.info("User login successful", { email, userId: user._id });
    } else {
      // Development mode - simulate user login
      logger.info("Development mode: User login simulation", { email });
      user = {
        _id: "dev_user_id",
        email: email,
        firstName: "Test",
        lastName: "User",
        isVerified: true,
        isGoogleVerified: false,
      };
    }

    // Create JWT token for authenticated session
    const authTokenData = {
      userId: user._id,
      email: user.email,
      isVerified: user.isVerified,
      loginType: "email",
    };

    const authToken = jwt.sign(authTokenData, process.env.JWT_SECRET, {
      expiresIn: "24h", // 24 hour session
    });

    // Set authentication cookie
    res.cookie("authToken", authToken, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Return user data (exclude sensitive info)
    const userData = {
      userId: user._id,
      email: user.email,
      firstName: user.firstName || "User",
      lastName: user.lastName || "",
      isVerified: user.isVerified,
      isGoogleVerified: user.isGoogleVerified || false,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userData,
        token: authToken,
      },
    });
  } catch (err) {
    logger.error("Error in verifyUser:", {
      error: err.message,
      email: email,
      stack: err.stack,
    });

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Check authentication status
const authLogin = asyncHandler(async (req, res, next) => {
  logger.info("Authentication status check requested");

  try {
    // Get token from cookie or Authorization header
    let token = req.cookies.authToken;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      logger.info("No authentication token found");
      return res.status(401).json({
        success: false,
        error: "Not authenticated",
        isAuthenticated: false,
      });
    }

    // Verify JWT token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      logger.info("User authentication verified", {
        userId: decoded.userId,
        email: decoded.email,
      });

      let userData = null;

      if (process.env.DATABASE_MODE !== "development") {
        // Get fresh user data from database
        const user = await getUserInfo(decoded.email);
        if (!user) {
          logger.warn("Token valid but user not found in database", {
            email: decoded.email,
          });
          return res.status(401).json({
            success: false,
            error: "User not found",
            isAuthenticated: false,
          });
        }

        userData = {
          userId: user._id,
          email: user.email,
          firstName: user.firstName || "User",
          lastName: user.lastName || "",
          isVerified: user.isVerified,
          isGoogleVerified: user.isGoogleVerified || false,
        };
      } else {
        // Development mode - return decoded token data
        userData = {
          userId: decoded.userId,
          email: decoded.email,
          firstName: "Test",
          lastName: "User",
          isVerified: decoded.isVerified,
          isGoogleVerified: false,
        };
      }

      return res.status(200).json({
        success: true,
        message: "User is authenticated",
        isAuthenticated: true,
        data: {
          user: userData,
        },
      });
    } catch (jwtError) {
      logger.warn("Invalid authentication token", { error: jwtError.message });
      return res.status(401).json({
        success: false,
        error: "Invalid token",
        isAuthenticated: false,
      });
    }
  } catch (err) {
    logger.error("Error in authLogin:", {
      error: err.message,
      stack: err.stack,
    });

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Logout user
const authLogout = asyncHandler(async (req, res, next) => {
  logger.info("User logout requested");

  try {
    // Clear authentication cookie
    res.clearCookie("authToken");

    // Also clear any other auth-related cookies
    res.clearCookie(process.env.EMAIL_COOKIE_NAME || "emailToken");

    logger.info("User logged out successfully");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    logger.error("Error in authLogout:", {
      error: err.message,
      stack: err.stack,
    });

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

module.exports = {
  googleAuthPage,
  redirectGoogleEmail,
  createOtp,
  verifyOpt,
  verifyUser,
  authLogin,
  authLogout,
};
