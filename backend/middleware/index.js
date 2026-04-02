const authMiddleware = require('./authMiddleware');
const roleMiddleware = require('./roleMiddleware');
const errorMiddleware = require('./errorMiddleware');
const upload = require('./upload');

module.exports = {
  authMiddleware,
  roleMiddleware,
  errorMiddleware,
  upload
};
