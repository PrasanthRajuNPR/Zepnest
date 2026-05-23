const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

const userOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'user') {
    return res.status(403).json({ message: 'Access denied: Users only' });
  }
  next();
};

module.exports = { adminOnly, userOnly };
