const User = require('../models/User');
const bcrypt = require('bcryptjs');


exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || password === undefined || password === null) {
      return res.status(400).json({ error: 'username, email and password are required' });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this username or email already exists' });
    }
    const passwordValue = typeof password === 'string' ? password : String(password);
    const hashedPassword = await bcrypt.hash(passwordValue, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    req.session.user = { _id: user._id, username: user.username, email: user.email, role: user.role || 'guest' };
    res.json({ user: req.session.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!password || (!username && !email)) {
      return res.status(400).json({ error: 'username or email and password are required' });
    }
    const user = username
      ? await User.findOne({ username })
      : await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session.user = { _id: user._id, username: user.username, email: user.email, role: user.role || 'guest' };
    res.json({ user: req.session.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
};

exports.me = (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};
