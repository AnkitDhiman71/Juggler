const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
router.get('/admin/dashboard', authMiddleware, requireRole('admin'), (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
});
router.get('/guest/dashboard', authMiddleware, requireRole('guest'), (req, res) => {
  res.json({ message: 'Welcome to the guest dashboard!' });
});

module.exports = router;
