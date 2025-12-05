const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
// Helper function to generate JWT token
const generateToken = (id) => {
return jwt.sign({ id }, process.env.JWT_SECRET, {
expiresIn: process.env.JWT_EXPIRE || '7d'
});
};
// Admin Login
exports.login = async (req, res, next) => {
try {
const { username, password } = req.body;
// Validate input
if (!username || !password) {
return res.status(400).json({
success: false,
message: 'Please provide username and password'
});
}
// Find admin by username
const admin = await Admin.findOne({ username: username.toLowerCase() });
if (!admin) {
return res.status(401).json({
success: false,
message: 'Invalid username or password'
});
}
// Compare password
const isPasswordCorrect = await admin.comparePassword(password);
if (!isPasswordCorrect) {
return res.status(401).json({
success: false,
message: 'Invalid username or password'
});
}
// Generate token
const token = generateToken(admin._id);
res.status(200).json({
success: true,
message: 'Login successful',
token,
admin: {
id: admin._id,
username: admin.username,
email: admin.email,
role: admin.role
}
});
} catch (error) {
next(error);
}
};
// Admin Logout (optional - mainly for client-side token cleanup)
exports.logout = async (req, res, next) => {
try {
res.status(200).json({
success: true,
message: 'Logout successful. Please clear the token from client storage.'
});
} catch (error) {
next(error);
}
};
// Create Admin (for initial setup only)
exports.createAdmin = async (req, res, next) => {
try {
const { username, email, password } = req.body;
// Validate input
if (!username || !email || !password) {
return res.status(400).json({
success: false,
message: 'Please provide all required fields'
});
}
// Check if admin already exists
const existingAdmin = await Admin.findOne({
$or: [{ username }, { email }]
});
if (existingAdmin) {
return res.status(409).json({
success: false,
message: 'Username or email already exists'
});
}
// Create new admin
const admin = new Admin({
username: username.toLowerCase(),
email: email.toLowerCase(),
password,
role: 'admin'
});
await admin.save();
res.status(201).json({
success: true,
message: 'Admin created successfully',
admin: {
id: admin._id,
username: admin.username,
email: admin.email
}
});
} catch (error) {
next(error);
}
};