const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET;

/**
 * Middleware function to authenticate student using JWT token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 */
const authenticateStudent = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, jwtSecretKey);
    req.user = decodedToken; // Attach the user information to the request object

    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authenticateStudent;
