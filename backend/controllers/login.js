const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET;

/**
 * Login a user with the provided username and password.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the user login is completed.
 */
async function loginUser(req, res) {
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
      email: user.email,
      role:user.role,
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
}

module.exports = loginUser;
