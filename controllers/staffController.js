const Staff = require('../models/Staff');
// Add new staff member
exports.addStaff = async (req, res, next) => {
try {
const { name, phone, email, type, address } = req.body;
// Validate input
if (!name || !phone || !email || !type) {
return res.status(400).json({
success: false,
message: 'Please provide all required fields (name, phone, email, type)'
});
}
// Validate type
if (!['Driver', 'Mechanic'].includes(type)) {
return res.status(400).json({
success: false,
message: 'Type must be either "Driver" or "Mechanic"'
});
}
// Check if staff already exists
const existingStaff = await Staff.findOne({
$or: [{ phone }, { email }]
});
if (existingStaff) {
return res.status(409).json({
success: false,
message: 'Staff member with this phone or email already exists'
});
}
// Create new staff
const staff = new Staff({
name,
phone,
email: email.toLowerCase(),
type,
address,
available: true
});
await staff.save();
res.status(201).json({
success: true,
message: 'Staff member added successfully',
data: staff
});
} catch (error) {
next(error);
}
};
// Get all staff
exports.getAllStaff = async (req, res, next) => {
try {
const staff = await Staff.find().sort({ createdAt: -1 });
res.status(200).json({
success: true,
count: staff.length,
data: staff
});
} catch (error) {
next(error);
}
};
// Get drivers only
exports.getDrivers = async (req, res, next) => {
try {
const drivers = await Staff.find({ type: 'Driver' }).sort({ createdAt: -1 });
res.status(200).json({
success: true,
count: drivers.length,
data: drivers
});
} catch (error) {
next(error);
}
};
// Get mechanics only
exports.getMechanics = async (req, res, next) => {
try {
const mechanics = await Staff.find({ type: 'Mechanic' }).sort({ createdAt: -1 });
res.status(200).json({
success: true,
count: mechanics.length,
data: mechanics
});
} catch (error) {
next(error);
}
};
// Get available staff
exports.getAvailableStaff = async (req, res, next) => {
try {
const { type } = req.query;
const filter = { available: true };
if (type) filter.type = type;
const availableStaff = await Staff.find(filter).sort({ createdAt: -1 });
res.status(200).json({
success: true,
count: availableStaff.length,
data: availableStaff
});
} catch (error) {
next(error);
}
};
// Update staff
exports.updateStaff = async (req, res, next) => {
try {
const { name, phone, email, type, address } = req.body;
const staff = await Staff.findByIdAndUpdate(
req.params.id,
{ name, phone, email, type, address },
{ new: true, runValidators: true }
);
if (!staff) {
return res.status(404).json({
success: false,
message: 'Staff member not found'
});
}
res.status(200).json({
success: true,
message: 'Staff member updated successfully',
data: staff
});
} catch (error) {
next(error);
}
};
// Toggle staff availability
exports.toggleAvailability = async (req, res, next) => {
try {
const staff = await Staff.findById(req.params.id);
if (!staff) {
return res.status(404).json({
success: false,
message: 'Staff member not found'
});
}
staff.available = !staff.available;
await staff.save();
res.status(200).json({
success: true,
message: `Staff member is now ${staff.available ? 'available' : 'unavailable'}`,
data: staff
});
} catch (error) {
next(error);
}
};
// Remove staff member
exports.removeStaff = async (req, res, next) => {
try {
const staff = await Staff.findByIdAndDelete(req.params.id);
if (!staff) {
return res.status(404).json({
success: false,
message: 'Staff member not found'
});
}
res.status(200).json({
success: true,
message: 'Staff member removed successfully'
});
} catch (error) {
next(error);
}
};
