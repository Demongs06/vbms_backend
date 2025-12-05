const mongoose = require('mongoose');
const billSchema = new mongoose.Schema({
requestId: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Request',
required: true,
unique: true
},
customerName: {
type: String,
required: true
},
serviceType: {
type: String,
required: true
},
baseAmount: {
type: Number,
required: true,
min: 0
},
additionalCharges: {
type: Number,
default: 0,
min: 0
},
tax: {
type: Number,
required: true,
min: 0
},
total: {
type: Number,
required: true,
min: 0
},
status: {
type: String,
enum: ['Paid', 'Unpaid'],
default: 'Unpaid'
},
createdDate: {
type: Date,
default: Date.now
},
paidDate: {
type: Date
}
});
// Pre-save middleware to calculate total
billSchema.pre('save', function(next) {
this.total = this.baseAmount + this.additionalCharges + this.tax;
next();
});
// Index
billSchema.index({ requestId: 1 });
billSchema.index({ status: 1 });
module.exports = mongoose.model('Bill', billSchema);
