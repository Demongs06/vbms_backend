const Request = require('../models/Request');
const Customer = require('../models/Customer');
// Create new service request
exports.createRequest = async (req, res, next) => {
try {
const {
customerName,
phone,
email,
vehicleType,
vehicleNumber,
problemType,
description,
latitude,
longitude
} = req.body;
// Validate input
if (!customerName || !phone || !email || !vehicleType || !vehicleNumber ||
!problemType || !description || latitude === undefined || longitude === undefined) {
  return res.status(400).json({
    success: false,
    message: 'Please provide all required fields'
  });
}
// Validate coordinates
if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
return res.status(400).json({
success: false,
message: 'Invalid latitude or longitude values'
});
}
// Create or get customer
let customer = await Customer.findOne({ email: email.toLowerCase() });
if (!customer) {
customer = new Customer({
name: customerName,
phone,
email: email.toLowerCase()
});
await customer.save();
}
// Create request
const request = new Request({
customerId: customer._id,
customerName,
phone,
vehicleType,
vehicleNumber: vehicleNumber.toUpperCase(),
problemType,
description,
latitude,
longitude,
status: 'Pending'
});
await request.save();
res.status(201).json({
success: true,
message: 'Request submitted successfully',
data: request
});
} catch (error) {
next(error);
}
};
// Get all requests with filters
exports.getAllRequests = async (req, res, next) => {
try {
const { status, customerId, page = 1, limit = 10 } = req.query;
// Build filter object
const filter = {};
if (status) filter.status = status;
if (customerId) filter.customerId = customerId;
// Get requests with pagination
const skip = (page - 1) * limit;
const requests = await Request.find(filter)
.sort({ createdDate: -1 })
.skip(skip)
.limit(parseInt(limit));
const total = await Request.countDocuments(filter);
res.status(200).json({
success: true,
count: requests.length,
total,
page: parseInt(page),
pages: Math.ceil(total / limit),
data: requests
});
} catch (error) {
next(error);
}
};
// Get request by ID
exports.getRequestById = async (req, res, next) => {
try {
const request = await Request.findById(req.params.id);
if (!request) {
return res.status(404).json({
success: false,
message: 'Request not found'
});
}
res.status(200).json({
success: true,
data: request
});
} catch (error) {
next(error);
}
};
// Accept request
exports.acceptRequest = async (req, res, next) => {
try {
const request = await Request.findByIdAndUpdate(
req.params.id,
{ status: 'Accepted' },
{ new: true, runValidators: true }
);
if (!request) {
return res.status(404).json({
success: false,
message: 'Request not found'
});
}
res.status(200).json({
success: true,
message: 'Request accepted successfully',
data: request
});
} catch (error) {
next(error);
}
};
// Assign staff to request
exports.assignStaff = async (req, res, next) => {
try {
const { assignedDriver, assignedMechanic } = req.body;
if (!assignedDriver && !assignedMechanic) {
return res.status(400).json({
success: false,
message: 'Please assign at least a driver or mechanic'
});
}
const request = await Request.findByIdAndUpdate(
req.params.id,
{
status: 'In Progress',
assignedDriver: assignedDriver || null,
assignedMechanic: assignedMechanic || null
},
{ new: true, runValidators: true }
);
if (!request) {
return res.status(404).json({
success: false,
message: 'Request not found'
});
}
res.status(200).json({
success: true,
message: 'Staff assigned successfully',
data: request
});
} catch (error) {
next(error);
}
};
// Mark request as complete
exports.completeRequest = async (req, res, next) => {
try {
const request = await Request.findByIdAndUpdate(
req.params.id,
{
status: 'Completed',
completedDate: new Date()
},
{ new: true, runValidators: true }
);
if (!request) {
return res.status(404).json({
success: false,
message: 'Request not found'
});
}
res.status(200).json({
success: true,
message: 'Request completed successfully',
data: request
});
} catch (error) {
next(error);
}
};
// Cancel request
exports.cancelRequest = async (req, res, next) => {
try {
const { reason } = req.body;
const request = await Request.findByIdAndUpdate(
req.params.id,
{
status: 'Cancelled',
cancellationReason: reason || 'Admin cancelled'
},
{ new: true, runValidators: true }
);
if (!request) {
return res.status(404).json({
success: false,
message: 'Request not found'
});
}
res.status(200).json({
success: true,
message: 'Request cancelled successfully',
data: request
});
} catch (error) {
next(error);
}
};
// Get request statistics
exports.getRequestStats = async (req, res, next) => {
try {
const stats = await Request.aggregate([
{
$group: {
_id: '$status',
count: { $sum: 1 }
}
}
]);
const formattedStats = {
pending: 0,
accepted: 0,
inProgress: 0,
completed: 0,
cancelled: 0
};
stats.forEach(stat => {
const status = stat._id.toLowerCase().replace(' ', '');
if (status === 'inprogress') {
formattedStats.inProgress = stat.count;
} else {
formattedStats[status] = stat.count;
}
});
res.status(200).json({
success: true,
data: formattedStats
});
} catch (error) {
next(error);
}
};