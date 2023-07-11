const User = require("../../models/User");

/**
 * Ban a student by setting the ban status and ban expiration time.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the student is banned successfully.
 */
const banStudent = async (req, res) => {
  const { email, banDurationInMinutes } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate the ban expiration time
    const banExpiration = new Date();
    banExpiration.setMinutes(banExpiration.getMinutes() + banDurationInMinutes);

    // Set the ban status and ban expiration time for the user
    user.isBanned = true;
    user.banExpiration = banExpiration;
    await user.save();

    res.json({ message: "Student banned successfully" });
  } catch (error) {
    console.error("Error banning student:", error);
    res.status(500).json({ message: "Error banning student" });
  }
};

module.exports = banStudent;
