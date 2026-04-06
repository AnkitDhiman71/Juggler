const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { validateLoginRequest,validateSignupRequest } = require('../validations');
const { sendOTP } = require('../utils/sendEmail');


exports.register = async (req, res) => {
  try {
    const { username, email, password } = await validateSignupRequest.validate(req.body);

    const existingUser = await User.find({ $or: [{ username }, { email }] });
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'User with this username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({ username, email, password: hashedPassword, otp, otpExpires });

    // Send OTP email
    await sendOTP(email, otp);

    res.json({ message: 'OTP sent to your email', userId: user._id });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.errors });
    }
    res.status(400).json({ error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    req.session.user = { _id: user._id, username: user.username, email: user.email, role: user.role || 'guest' };
    res.json({ message: 'Email verified successfully', user: req.session.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTP(email, otp);

    res.json({ message: 'New OTP sent to your email' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = await validateLoginRequest.validate(req.body);
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session.user = { _id: user._id, username: user.username, email: user.email, role: user.role || 'guest' };
    res.json({ user: req.session.user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.errors });
    }
    res.status(400).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
};
