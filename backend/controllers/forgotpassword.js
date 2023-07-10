const User = require("../models/User");
const { generateOTP } = require("../utils");
const nodemailer = require("nodemailer");

/**
 * Send a password reset OTP (One-Time Password) to the user's email address.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the OTP is sent successfully.
 */
async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    // Find the user with the provided email address
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Update the user's OTP in the database
    user.otp = otp;

    // Save the updated user to the database
    await user.save();

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email with OTP to the provided email address
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
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
  } catch (error) {
    console.log("Error finding user:", error);
    return res.status(500).json({ message: "Error finding user" });
  }
}

module.exports = forgotPassword;
