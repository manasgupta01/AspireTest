const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET;

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, jwtSecretKey);
    req.user = decodedToken; // Attach the user information to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports=authenticateUser