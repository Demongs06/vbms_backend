const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
requestId: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Request',
required: true
},
customerId: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Customer',
required: true
},
customerName: {
type: String,
required: true
},
rating: {
type: Number,
required: true,
min: 1,
max: 5
},
reviewText: {
type: String,
required: true,
maxlength: 1000
},
serviceType: {
type: String,
required: true
},
createdDate: {
type: Date,
default: Date.now
}
});
// Indexes
reviewSchema.index({ requestId: 1 });
reviewSchema.index({ rating: -1 });
module.exports = mongoose.model('Review', reviewSchema);