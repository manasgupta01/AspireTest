const User = require("../models/User");

async function verifyUser(req, res) {
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
}

module.exports = verifyUser;
