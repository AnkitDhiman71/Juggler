const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'guest'],
      default: 'guest',
    },
    displayName: String,
    bio: String,
    profilePicture: String,
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
