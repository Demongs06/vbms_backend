const Customer = require('../models/Customer');
// Create new customer
exports.createCustomer = async (req, res, next) => {
try {
const { name, phone, email } = req.body;
// Validate input
if (!name || !phone || !email) {
return res.status(400).json({
success: false,
message: 'Please provide all required fields (name, phone, email)'
});
}
// Check if customer already exists
const existingCustomer = await Customer.findOne({
$or: [{ phone }, { email }]
});
if (existingCustomer) {
return res.status(409).json({
success: false,
message: 'Customer with this phone or email already exists'
});
}
// Create new customer
const customer = new Customer({
name,
phone,
email: email.toLowerCase()
});
await customer.save();
res.status(201).json({
success: true,
message: 'Customer created successfully',
data: customer
});
} catch (error) {
next(error);
}
};
// Get customer by ID
exports.getCustomerById = async (req, res, next) => {
try {
const customer = await Customer.findById(req.params.id);
if (!customer) {
return res.status(404).json({
success: false,
message: 'Customer not found'
});
}
res.status(200).json({
success: true,
data: customer
});
} catch (error) {
next(error);
}
};
// Get all customers
exports.getAllCustomers = async (req, res, next) => {
try {
const customers = await Customer.find().sort({ createdAt: -1 });
res.status(200).json({
success: true,
count: customers.length,
data: customers
});
} catch (error) {
next(error);
}
};
// Update customer
exports.updateCustomer = async (req, res, next) => {
try {
const { name, phone, email } = req.body;
const customer = await Customer.findByIdAndUpdate(
req.params.id,
{ name, phone, email },
{ new: true, runValidators: true }
);
if (!customer) {
return res.status(404).json({
success: false,
message: 'Customer not found'
});
}
res.status(200).json({
success: true,
message: 'Customer updated successfully',
data: customer
});
} catch (error) {
next(error);
}
};
// Delete customer
exports.deleteCustomer = async (req, res, next) => {
try {
const customer = await Customer.findByIdAndDelete(req.params.id);
if (!customer) {
return res.status(404).json({
success: false,
message: 'Customer not found'
});
}
res.status(200).json({
success: true,
message: 'Customer deleted successfully'
});
} catch (error) {
next(error);
}
};