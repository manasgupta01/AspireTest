require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();

const crypto = require("crypto");
const jwtSecretKey = crypto.randomBytes(32).toString("hex");

// Middleware to parse JSON data
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });


// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});



// Controllers
const registerUser = require("./controllers/registeruser");
const verifyUser = require("./controllers/verifyuser");
const loginUser = require("./controllers/login");
const forgotPassword = require("./controllers/forgotpassword");
const resetPassword = require("./controllers/resetpassword");

// Register a new user
app.post("/register", registerUser);

// Verify the user with OTP
app.post("/verify", verifyUser);

// Forgot Password - Generate OTP and send email
app.post("/forgotpassword", forgotPassword);

// Reset Password
app.put("/resetpassword", resetPassword);

// Authenticate a user and generate JWT token
app.post("/login", loginUser);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
