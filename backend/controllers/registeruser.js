const User = require("../models/User");
const { generateOTP } = require("../utils");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

/**
 * Register a new user with the provided details.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the user registration is completed.
 */
const registerUser = async (req, res) => {
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

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

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
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Registration OTP",
      text: `Your OTP for registration is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        return res.status(201).json({ message: "User registered successfully" });
      }
    });
  } catch (error) {
    console.log("Error registering user:", error);
    return res.status(500).json({ message: "Error registering user" });
  }
};

module.exports = registerUser;
