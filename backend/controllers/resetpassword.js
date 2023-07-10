const User = require("../models/User");
const bcrypt = require("bcrypt");

/**
 * Reset the password for a user using the provided email, OTP, and new password.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the password reset is completed.
 */
async function resetPassword(req, res) {
  const { email, otp, newPassword, confirmNewPassword } = req.body;

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

    // Check if newPassword and confirmNewPassword match
    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    // Update the user's password in the database
    user.password = await bcrypt.hash(newPassword, 10);

    // Clear the user's OTP
    user.otp = "";

    // Save the updated user to the database
    await user.save();

    console.log("Password reset successfully for user:", user);
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log("Error resetting password:", error);
    return res.status(500).json({ message: "Error resetting password" });
  }
}

module.exports = resetPassword;
