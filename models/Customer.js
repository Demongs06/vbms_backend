const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
name: {
type: String,
required: [true, 'Customer name is required'],
trim: true,
maxlength: [100, 'Name cannot exceed 100 characters']
},
phone: {
type: String,
required: [true, 'Phone number is required'],
unique: true,
match: [/^\\+?[1-9]\\d{9,14}$/, 'Please provide a valid phone number']
},
email: {
type: String,
required: [true, 'Email is required'],
unique: true,
lowercase: true,
match: [/^\\S+@\\S+\\.\\S+$/, 'Please provide a valid email']
},
createdAt: {
type: Date,
default: Date.now
}
});
// Index for faster queries
customerSchema.index({ phone: 1 });
customerSchema.index({ email: 1 });
module.exports = mongoose.model('Customer', customerSchema);
