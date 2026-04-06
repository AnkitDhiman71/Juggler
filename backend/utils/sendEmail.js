const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ankitdhiman202005@gmail.com',
    pass: 'zjxz nuyw bxat afqz',
  },
});

const sendOTP = async (toEmail, otp) => {
  const mailOptions = {
    from: 'ankitdhiman202005@gmail.com',
    to: toEmail,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
    html: `<h2>Your OTP Code</h2><p>Your OTP code is: <strong>${otp}</strong></p><p>It is valid for 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };
