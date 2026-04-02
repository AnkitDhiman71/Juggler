# Juggler Backend Controllers - Complete Explanation

This document provides a detailed line-by-line explanation of all controllers in the Juggler backend.

---

## Table of Contents

1. [adminBootstrap.js](#adminbootstrapjs)
2. [userController.js](#usercontrollerjs)

---

## adminBootstrap.js

**Purpose:** This controller ensures that an admin user exists in the database. It is typically run during application startup to bootstrap the admin account.

### Line-by-Line Explanation

```javascript
const User = require('../models/User');
```
- **Line 1:** Imports the `User` Mongoose model from the models directory. This model is used to interact with the users collection in the database.

```javascript
const bcrypt = require('bcryptjs');
```
- **Line 2:** Imports the `bcryptjs` library, which is used for hashing passwords securely before storing them in the database.

```javascript
async function ensureAdmin() {
```
- **Line 4:** Declares an asynchronous function named `ensureAdmin`. This function will check if an admin exists and create one if necessary.

```javascript
  const adminEmail = 'a@gmail.com';
```
- **Line 5:** Defines the default admin email address (`a@gmail.com`).

```javascript
  const adminPassword = '11223344';
```
- **Line 6:** Defines the default admin password (`11223344`). **Note:** In production, this should be set via environment variables for security.

```javascript
  const adminRole = 'admin';
```
- **Line 7:** Defines the role string that will be assigned to the admin user.

```javascript
  let admin = await User.findOne({ email: adminEmail });
```
- **Line 8:** Queries the database to find a user with the admin email. The `await` keyword waits for the database operation to complete.

```javascript
  if (!admin) {
```
- **Line 9:** Checks if no admin user was found (admin is null/undefined).

```javascript
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
```
- **Line 10:** Hashes the admin password using bcrypt with a salt rounds value of 10. This creates a secure hash for storage.

```javascript
    admin = new User({ username: 'admin', email: adminEmail, password: hashedPassword, role: adminRole });
```
- **Line 11:** Creates a new User document with username 'admin', the admin email, hashed password, and admin role.

```javascript
    await admin.save();
```
- **Line 12:** Saves the newly created admin user to the database.

```javascript
    console.log('Admin user created:', adminEmail);
```
- **Line 13:** Logs a message to the console confirming the admin user was created.

```javascript
  } else if (admin.role !== adminRole) {
```
- **Line 14:** If admin exists, checks if their role is not already set to 'admin'.

```javascript
    admin.role = adminRole;
```
- **Line 15:** Updates the existing user's role to 'admin'.

```javascript
    await admin.save();
```
- **Line 16:** Saves the updated user document to the database.

```javascript
    console.log('Admin user role updated:', adminEmail);
```
- **Line 17:** Logs a message confirming the admin role was updated.

```javascript
}
```
- **Line 18:** Closes the `ensureAdmin` function.

```javascript
module.exports = ensureAdmin;
```
- **Line 20:** Exports the `ensureAdmin` function so it can be imported and used in other files (like server.js or app.js).

---

## userController.js

**Purpose:** This controller handles all user authentication-related operations including registration, login, logout, and retrieving current user information.

### Line-by-Line Explanation

```javascript
const User = require('../models/User');
```
- **Line 1:** Imports the `User` Mongoose model from the models directory for database operations.

```javascript
const bcrypt = require('bcryptjs');
```
- **Line 2:** Imports the `bcryptjs` library for password hashing and comparison.

---

### `register` Function

```javascript
exports.register = async (req, res) => {
```
- **Line 4:** Exports an asynchronous `register` function that handles user registration. It takes `req` (request) and `res` (response) parameters.

```javascript
  try {
```
- **Line 5:** Starts a try-catch block to handle potential errors during registration.

```javascript
    const { username, email, password } = req.body;
```
- **Line 6:** Destructures `username`, `email`, and `password` from the request body.

```javascript
    if (!username || !email || password === undefined || password === null) {
```
- **Line 7:** Validates that all required fields are present. Checks if username or email are falsy, or if password is undefined/null.

```javascript
      return res.status(400).json({ error: 'username, email and password are required' });
```
- **Line 8:** Returns a 400 Bad Request status with an error message if validation fails.

```javascript
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
```
- **Line 9:** Searches the database for any existing user with the same username OR email using MongoDB's `$or` operator.

```javascript
    if (existingUser) {
```
- **Line 10:** Checks if a user with the same username or email already exists.

```javascript
      return res.status(409).json({ error: 'User with this username or email already exists' });
```
- **Line 11:** Returns a 409 Conflict status with an error message if the user already exists.

```javascript
    const passwordValue = typeof password === 'string' ? password : String(password);
```
- **Line 12:** Ensures the password is a string by converting it if necessary (handles edge cases where password might be a number).

```javascript
    const hashedPassword = await bcrypt.hash(passwordValue, 10);
```
- **Line 13:** Hashes the password using bcrypt with 10 salt rounds for secure storage.

```javascript
    const user = new User({ username, email, password: hashedPassword });
```
- **Line 14:** Creates a new User document with the provided username, email, and hashed password.

```javascript
    await user.save();
```
- **Line 15:** Saves the new user to the database.

```javascript
    req.session.user = { _id: user._id, username: user.username, email: user.email, role: user.role || 'guest' };
```
- **Line 16:** Stores user information in the session for authentication. Includes `_id`, `username`, `email`, and `role` (defaults to 'guest' if not set).

```javascript
    res.json({ user: req.session.user });
```
- **Line 17:** Sends a JSON response containing the newly created user's session data.

```javascript
  } catch (error) {
```
- **Line 18:** Catches any errors that occur during the registration process.

```javascript
    res.status(400).json({ error: error.message });
```
- **Line 19:** Returns a 400 Bad Request status with the error message.

```javascript
  }
```
- **Line 20:** Closes the try-catch block.

```javascript
};
```
- **Line 21:** Ends the `register` function.

---

### `login` Function

```javascript
exports.login = async (req, res) => {
```
- **Line 24:** Exports an asynchronous `login` function that handles user authentication.

```javascript
  try {
```
- **Line 25:** Starts a try-catch block for error handling.

```javascript
    const { username, email, password } = req.body;
```
- **Line 26:** Destructures `username`, `email`, and `password` from the request body.

```javascript
    if (!password || (!username && !email)) {
```
- **Line 27:** Validates that password is provided AND either username OR email is provided.

```javascript
      return res.status(400).json({ error: 'username or email and password are required' });
```
- **Line 28:** Returns a 400 Bad Request status with an error message if validation fails.

```javascript
    const user = username
```
- **Line 29:** Begins a ternary expression to find the user.

```javascript
      ? await User.findOne({ username })
```
- **Line 30:** If username is provided, searches for a user by username.

```javascript
      : await User.findOne({ email });
```
- **Line 31:** If username is not provided, searches for a user by email instead.

```javascript
    if (!user || !(await bcrypt.compare(password, user.password))) {
```
- **Line 32:** Checks if user doesn't exist OR if the provided password doesn't match the hashed password in the database using bcrypt.compare().

```javascript
      return res.status(401).json({ error: 'Invalid credentials' });
```
- **Line 33:** Returns a 401 Unauthorized status with an error message for invalid credentials.

```javascript
    req.session.user = { _id: user._id, username: user.username, email: user.email, role: user.role || 'guest' };
```
- **Line 34:** Stores user information in the session upon successful login.

```javascript
    res.json({ user: req.session.user });
```
- **Line 35:** Sends a JSON response containing the logged-in user's session data.

```javascript
  } catch (error) {
```
- **Line 36:** Catches any errors during the login process.

```javascript
    res.status(400).json({ error: error.message });
```
- **Line 37:** Returns a 400 Bad Request status with the error message.

```javascript
  }
```
- **Line 38:** Closes the try-catch block.

```javascript
};
```
- **Line 39:** Ends the `login` function.

---

### `logout` Function

```javascript
exports.logout = (req, res) => {
```
- **Line 41:** Exports a synchronous `logout` function that handles user logout.

```javascript
  req.session.destroy(() => {
```
- **Line 42:** Destroys the user's session. The callback function executes after the session is destroyed.

```javascript
    res.clearCookie('connect.sid');
```
- **Line 43:** Clears the session cookie (`connect.sid`) from the user's browser.

```javascript
    res.json({ message: 'Logged out' });
```
- **Line 44:** Sends a JSON response confirming the user has been logged out.

```javascript
  });
```
- **Line 45:** Closes the callback for session.destroy().

```javascript
};
```
- **Line 46:** Ends the `logout` function.

---

### `me` Function

```javascript
exports.me = (req, res) => {
```
- **Line 48:** Exports a synchronous `me` function that returns the current authenticated user's information.

```javascript
  if (req.session.user) {
```
- **Line 49:** Checks if there is a user stored in the session (meaning they are authenticated).

```javascript
    res.json({ user: req.session.user });
```
- **Line 50:** Returns the current user's session data as JSON.

```javascript
  } else {
```
- **Line 51:** If no user is in the session (not authenticated).

```javascript
    res.status(401).json({ error: 'Not authenticated' });
```
- **Line 52:** Returns a 401 Unauthorized status with an error message.

```javascript
  }
```
- **Line 53:** Closes the if-else block.

```javascript
};
```
- **Line 54:** Ends the `me` function.

---

## Summary

| Controller | Function | Purpose |
|------------|----------|---------|
| adminBootstrap.js | ensureAdmin() | Creates/updates admin user on startup |
| userController.js | register | Registers new users and creates session |
| userController.js | login | Authenticates users and creates session |
| userController.js | logout | Destroys session and clears cookie |
| userController.js | me | Returns current authenticated user info |

---

## Security Notes

1. **Password Hashing:** All passwords are hashed using bcrypt with 10 salt rounds before storage.
2. **Session Management:** User authentication state is maintained via express-session.
3. **Default Admin Credentials:** The admin bootstrap uses hardcoded credentials - in production, these should be set via environment variables.
4. **Error Handling:** All sensitive operations are wrapped in try-catch blocks to prevent information leakage.

---

*Generated for Juggler Backend - March 2026*
