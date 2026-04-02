const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware');
router.get('/admin/dashboard', authMiddleware, roleMiddleware.requireRole('admin'), (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
});
router.get('/guest/dashboard', authMiddleware, roleMiddleware.requireRole('guest'), (req, res) => {
  res.json({ message: 'Welcome to the guest dashboard!' });
});

module.exports = router;
