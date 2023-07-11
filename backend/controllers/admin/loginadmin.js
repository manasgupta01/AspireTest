const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const jwtSecretKey = process.env.JWT_SECRET;

/**
 * Login an admin user and generate a JWT token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the admin user is logged in successfully.
 */
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
 
  try {
    // Find the admin user by email
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate the password
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ email:email, role: admin.role }, jwtSecretKey);

    console.log("Admin logged in successfully:");
    console.log(admin);
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in admin:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = loginAdmin;
