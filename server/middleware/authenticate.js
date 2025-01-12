const jwt = require('jsonwebtoken');

// Middleware to authenticate users
exports.authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Middleware to authenticate admins
exports.authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, 'secret');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    req.user = decoded; // Attach admin info to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
