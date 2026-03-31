const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function ensureAdmin() {
  const adminEmail = 'a@gmail.com';
  const adminPassword = '11223344';
  const adminRole = 'admin';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    admin = new User({ username: 'admin', email: adminEmail, password: hashedPassword, role: adminRole });
    await admin.save();
    console.log('Admin user created:', adminEmail);
  } else if (admin.role !== adminRole) {
    admin.role = adminRole;
    await admin.save();
    console.log('Admin user role updated:', adminEmail);
  }
}

module.exports = ensureAdmin;
