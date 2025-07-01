const jwt = require('jsonwebtoken');

// Secret should later be moved to .env
const JWT_SECRET = 'SECRET_KEY';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Expected format: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Now req.user.id and req.user.role available
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admins only' });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
};
