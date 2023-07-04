require('dotenv').config();

const express = require("express");
const fs = require("fs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Database = require("./database"); 

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Initialize the database
const db = new Database("users.json");

// Write data to the JSON file
function writeDataToJsonFile() {
  const jsonData = JSON.stringify(users, null, 2);
  fs.writeFileSync(dbFilePath, jsonData, "utf8");
}

// Helper function to generate OTP
function generateOTP() {
  // Implement your logic to generate a 25-digit alphanumeric OTP here
  // For simplicity, we'll generate a random 25-character string
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let otp = "";
  for (let i = 0; i < 25; i++) {
    otp += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return otp;
}

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME, // Use environment variable
    pass: process.env.EMAIL_PASSWORD, // Use environment variable
  },
});

/** * Endpoint: /register
 * Method: POST
 * Description: Register a new user
 * Request Body:
 *   - username: string
 *   - password: string
 *   - confirmPassword: string
 *   - email: string
 *   - collegeName: string
 *   - firstName: string
 *   - lastName: string
 */
app.post("/register", (req, res) => {
  const {
    username,
    password,
    confirmPassword,
    email,
    collegeName,
    firstName,
    lastName,
  } = req.body;

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Password and confirm password do not match" });
  }

  // Check if username or email already exists
  const existingUser = db.getUserByUsername(username) || db.getUserByEmail(email);
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "Username or email already exists" });
  }

  // Generate OTP
  const otp = generateOTP();

  // Create user with the provided details
  const user = {
    username,
    password, // after testing encode the password for safety
    email,
    collegeName,
    firstName,
    lastName,
    otp,
    verified: false,
  };

  // Save the user to the in-memory store
  db.addUser(user);

  // // Write data to the JSON file
  // writeDataToJsonFile();

  // Send email with OTP to the provided email address
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Registration OTP",
    text: `Your OTP for registration is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });

  console.log("User registered successfully:");
  console.log(user);
  return res.status(201).json({ message: "User registered successfully" });
});

/*** Endpoint: /verify
 * Method: POST
 * Description: Verify the user with OTP
 * Request Body:
 *   - email: string
 *   - otp: string
 */
app.post("/verify", (req, res) => {
  const { email, otp } = req.body;

  // Find the user with the provided email address
  const user = db.getUserByEmail(email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the provided OTP matches the user's OTP
  if (otp !== user.otp) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  // Set the user as verified
  user.verified = true;

  // Write data to the JSON file
  db.updateUser(user);

  console.log("User verified successfully:");
  console.log(user);
  return res.status(200).json({ message: "User verified successfully" });
});

/** Endpoint: /login
 * Method: POST
 * Description: Authenticate a user and generate JWT token
 * Request Body:
 *   - username: string
 *   - password: string
 */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find the user with the provided username
  const user = db.getUserByUsername(username);

  // Check if user exist in user.json
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the password matches
  if (password !== user.password) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // Check if the user is verified
  if (!user.verified) {
    return res.status(401).json({ message: "User not verified" });
  }

  // Create a payload for the JWT token
  const payload = {
    username: user.username,
    email: user.email,
    collegeName: user.collegeName,
  };

  // Generate JWT token
  const token = jwt.sign(payload, "your-secret-key");

  console.log("User logged in successfully:");
  console.log(user);
  return res.status(200).json({ token });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Read data from the JSON file on server startup
db.readDataFromFile();
