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

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  collegeName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  otp: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

// Create the User model
const User = mongoose.model("User", userSchema);

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
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Register a new user
app.post("/register", async (req, res) => {
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

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Create user with the provided details
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      email,
      collegeName,
      firstName,
      lastName,
      otp,
      verified: false,
    });

    // Save the user to the database
    await user.save();

    // Send email with OTP to the provided email address
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Registration OTP",
      text: `Your OTP for registration is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    console.log("User registered successfully:");
    console.log(user);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("Error registering user:", error);
    return res.status(500).json({ message: "Error registering user" });
  }
});

// Verify the user with OTP
app.post("/verify", async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user with the provided email address
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided OTP matches the user's OTP
    if (otp !== user.otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // Set the user as verified
    user.verified = true;

    // Save the updated user to the database
    await user.save();

    console.log("User verified successfully:");
    console.log(user);
    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.log("Error verifying user:", error);
    return res.status(500).json({ message: "Error verifying user" });
  }
});

// Forgot Password - Generate OTP and send email
app.post("/forgotpassword", (req, res) => {
  const { email } = req.body;

  // Find the user with the provided email address
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate OTP
      const otp = generateOTP();

      // Update the user's OTP in the database
      user.otp = otp;

      // Save the updated user to the database
      user
        .save()
        .then(() => {
          // Send email with OTP to the provided email address
          const mailOptions = {
            from: "your-email@gmail.com",
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("Error sending email:", error);
              return res.status(500).json({ message: "Error sending email" });
            } else {
              console.log("Email sent:", info.response);
              return res.status(200).json({ message: "OTP sent successfully" });
            }
          });
        })
        .catch((error) => {
          console.log("Error updating user:", error);
          return res.status(500).json({ message: "Error updating user" });
        });
    })
    .catch((error) => {
      console.log("Error finding user:", error);
      return res.status(500).json({ message: "Error finding user" });
    });
});

// ...

/** Endpoint: /resetpassword
 * Method: PUT
 * Description: Reset the user's password using OTP
 * Request Body:
 *   - email: string
 *   - otp: string
 *   - newPassword: string
 */
app.put("/resetpassword", (req, res) => {
  const { email, otp, newPassword, confirmNewPassword } = req.body;

  // Find the user with the provided email address
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the provided OTP matches the user's OTP
      if (otp !== user.otp) {
        return res.status(401).json({ message: "Invalid OTP" });
      }

      // Check if the new password and confirm new password match
      if (newPassword !== confirmNewPassword) {
        return res
          .status(400)
          .json({ message: "New password and confirm password do not match" });
      }

      // Set the new password for the user
      user.password = newPassword;

      // Save the updated user to the database
      user
        .save()
        .then(() => {
          console.log("Password reset successfully for user:", user);
          return res
            .status(200)
            .json({ message: "Password reset successfully" });
        })
        .catch((error) => {
          console.log("Error updating user:", error);
          return res.status(500).json({ message: "Error resetting password" });
        });
    })
    .catch((error) => {
      console.log("Error finding user:", error);
      return res.status(500).json({ message: "Error resetting password" });
    });
});

// Authenticate a user and generate JWT token
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user with the provided username
    const user = await User.findOne({ username: username });

    // Check if user exists in the database
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
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
    const token = jwt.sign(payload, jwtSecretKey);

    console.log("User logged in successfully:");
    console.log(user);
    return res.status(200).json({ token });
  } catch (error) {
    console.log("Error logging in:", error);
    return res.status(500).json({ message: "Error logging in" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

