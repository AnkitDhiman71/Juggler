const User = require('../models/User');

const requireRole = (role) => async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== role) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role' });
    }
    next();
  } catch (err) {
    res.status(403).json({ error: 'Forbidden' });
  }
};

module.exports = { requireRole };