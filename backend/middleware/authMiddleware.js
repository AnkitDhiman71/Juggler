const authMiddleware = (req, res, next) => {
  if (req.session && req.session.user) {
    req.userId = req.session.user._id;
    req.user = req.session.user;
    return next();
  }
  return res.status(401).json({ error: 'Not authenticated' });
};

module.exports = authMiddleware;
