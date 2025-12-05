const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
customerId: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Customer',
required: true
},
customerName: {
type: String,
required: true
},
phone: {
type: String,
required: true
},
vehicleType: {
type: String,
required: true,
enum: ['Car', 'Bike', 'Truck', 'Auto Rickshaw', 'Other']
},
vehicleNumber: {
type: String,
required: true,
uppercase: true
},
problemType: {
type: String,
required: true,
enum: ['Oil Leakage', 'Breakdown', 'Puncture', 'Engine Failure',
'Battery Issue', 'Fuel Delivery', 'Other']
},
description: {
type: String,
required: true,
maxlength: 500
},
latitude: {
type: Number,
required: true,
min: -90,
max: 90
},
longitude: {
type: Number,
required: true,
min: -180,
max: 180
},
status: {
type: String,
enum: ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'],
default: 'Pending'
},
assignedDriver: {
type: String,
default: null
},
assignedMechanic: {
type: String,
default: null
},
createdDate: {
type: Date,
default: Date.now
},
completedDate: {
type: Date
}
});
// Indexes for efficient queries
requestSchema.index({ status: 1 });
requestSchema.index({ createdDate: -1 });
requestSchema.index({ customerId: 1 });
module.exports = mongoose.model('Request', requestSchema);
