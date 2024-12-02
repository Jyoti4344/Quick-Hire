const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
// const questions = require("./questions");
require("dotenv").config();

// app.get("/api/questions", (req, res) => {
//   res.send({ questions });
// });

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add pre-flight handling
app.options("*", cors(corsOptions));

// MongoDB Connection
const DB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/quick_hire_db";
mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
});

// Create User Model
const User = mongoose.model("User", userSchema);

// ========== AUTHENTICATION ROUTES ==========

// User Registration
app.post("/auth/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User Login
app.post("/auth/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Add debug logging
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Debug log for password comparison
    console.log("Comparing passwords for user:", email);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.log("Login successful for user:", email);

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
      details: error.message,
    });
  }
});

// Password Reset Request
app.post("/auth/request-password-reset", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "15m" }
    );
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // Token valid for 15 minutes
    await user.save();

    // Ideally, you should send this token via email
    res.json({ message: "Password reset token generated", resetToken });
  } catch (error) {
    console.error("Password Reset Request Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Password Reset
app.post("/auth/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");

    const user = await User.findOne({ _id: decoded.userId, resetToken: token });
    if (!user || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Password Reset Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected Route Example
app.get("/api/protected", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "secret_key", (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json({ message: "Access granted to protected route.", user: decoded });
  });
});

// ========== OTHER ROUTES ==========

// Get User Profile
app.get("/auth/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Profile Fetch Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Health Check
app.get("/health", (req, res) => {
  res.json({ message: "API is running smoothly!" });
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!", error: err.message });
});

// Add 404 handling
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} Not Found` });
});

// Start the Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`👉 CORS enabled for origins: ${corsOptions.origin.join(", ")}`);
});
