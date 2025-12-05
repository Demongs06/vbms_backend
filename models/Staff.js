const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema({
name: {
type: String,
required: [true, 'Staff name is required'],
trim: true
},
phone: {
type: String,
required: [true, 'Phone number is required'],
unique: true
},
email: {
type: String,
required: [true, 'Email is required'],
unique: true,
lowercase: true
},
type: {
type: String,
required: true,
enum: ['Driver', 'Mechanic']
},
available: {
type: Boolean,
default: true
},
createdAt: {
type: Date,
default: Date.now
}
});
// Indexes
staffSchema.index({ type: 1, available: 1 });
module.exports = mongoose.model('Staff', staffSchema);