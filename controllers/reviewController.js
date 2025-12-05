// const Bill = require('../models/Bill');
// const Request = require('../models/Request');
// // Generate bill for completed request
// exports.generateBill = async (req, res, next) => {
// try {
// const { requestId, baseAmount, additionalCharges = 0 } = req.body;
// // Validate input
// if (!requestId || !baseAmount) {
// return res.status(400).json({
// success: false,
// message: 'Please provide requestId and baseAmount'
// });
// }
// // Check if request exists and is completed
// const request = await Request.findById(requestId);
// if (!request) {
// return res.status(404).json({
// success: false,
// message: 'Request not found'
// });
// }
// // Check if bill already exists
// const existingBill = await Bill.findOne({ requestId });
// if (existingBill) {
// return res.status(409).json({
// success: false,
// message: 'Bill already exists for this request'
// });
// }
// // Calculate tax (18% GST)
// const taxRate = 0.18;
// const tax = Math.round((baseAmount + additionalCharges) * taxRate * 100) / 100;
// const total = baseAmount + additionalCharges + tax;
// // Create bill
// const bill = new Bill({
// requestId,
// customerName: request.customerName,
// serviceType: request.problemType,
// baseAmount,
// additionalCharges,
// tax,
// total,
// status: 'Unpaid'
// });
// await bill.save();
// res.status(201).json({
// success: true,
// message: 'Bill generated successfully',
// data: bill
// });
// } catch (error) {
// next(error);
// }
// };
// // Get all bills with filters
// exports.getAllBills = async (req, res, next) => {
// try {
// const { status, page = 1, limit = 10 } = req.query;
// const filter = {};
// if (status) filter.status = status;
// const skip = (page - 1) * limit;
// const bills = await Bill.find(filter)
// .sort({ createdDate: -1 })
// .skip(skip)
// .limit(parseInt(limit));
// const total = await Bill.countDocuments(filter);
// res.status(200).json({
// success: true,
// count: bills.length,
// total,
// page: parseInt(page),
// pages: Math.ceil(total / limit),
// data: bills
// });
// } catch (error) {
// next(error);
// }
// };
// // Get bill by ID
// exports.getBillById = async (req, res, next) => {
// try {
// const bill = await Bill.findById(req.params.id);
// if (!bill) {
// return res.status(404).json({
// success: false,
// message: 'Bill not found'
// });
// }
// res.status(200).json({
// success: true,
// data: bill
// });
// } catch (error) {
// next(error);
// }
// };
// // Mark bill as paid
// exports.markAsPaid = async (req, res, next) =>{
// try {
// const bill = await Bill.findByIdAndUpdate(
// req.params.id,
// {
// status: 'Paid',
// paidDate: new Date()
// },
// { new: true }
// );
// if (!bill) {
// return res.status(404).json({
// success: false,
// message: 'Bill not found'
// });
// }
// res.status(200).json({
// success: true,
// message: 'Bill marked as paid',
// data: bill
// });
// } catch (error) {
// next(error);
// }
// };
// // Get unpaid bills
// exports.getUnpaidBills = async (req, res, next) => {
// try {
// const unpaidBills = await Bill.find({ status: 'Unpaid' })
// .sort({ createdDate: -1 });
// res.status(200).json({
// success: true,
// count: unpaidBills.length,
// data: unpaidBills
// });
// } catch (error) {
// next(error);
// }
// };
// // Get billing statistics
// exports.getBillingStats = async (req, res, next) => {
// try {
// const stats = await Bill.aggregate([
// {
// $group: {
// _id: null,
// totalBills: { $sum: 1 },
// totalAmount: { $sum: '$total' },
// paidAmount: {
// $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, '$total', 0] }
// },
// unpaidAmount: {
// $sum: { $cond: [{ $eq: ['$status', 'Unpaid'] }, '$total', 0] }
// },
// paidCount: {
// $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0] }
// },
// unpaidCount: {
// $sum: { $cond: [{ $eq: ['$status', 'Unpaid'] }, 1, 0] }
// }
// }
// }
// ]);
// res.status(200).json({
// success: true,
// data: stats[0] || {
// totalBills: 0,
// totalAmount: 0,
// paidAmount: 0,
// unpaidAmount: 0,
// paidCount: 0,
// unpaidCount: 0
// }
// });
// } catch (error) {
// next(error);
// }
// };

// controllers/reviewController.js

// Example Mongoose model import (uncomment when you have a Review model)
// const Review = require('../models/Review');

const submitReview = async (req, res) => {
  try {
    // Example: const review = await Review.create(req.body);
    // return res.status(201).json(review);
    return res.status(201).json({ message: 'Review submitted' });
  } catch (err) {
    console.error('submitReview error:', err);
    return res.status(500).json({ error: err.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    // const reviews = await Review.find();
    return res.json([]);
  } catch (err) {
    console.error('getAllReviews error:', err);
    return res.status(500).json({ error: err.message });
  }
};

const getRecentReviews = async (req, res) => {
  try {
    // const reviews = await Review.find().sort({ createdAt: -1 }).limit(10);
    return res.json([]);
  } catch (err) {
    console.error('getRecentReviews error:', err);
    return res.status(500).json({ error: err.message });
  }
};

const getReviewsByServiceType = async (req, res) => {
  try {
    // const { type } = req.query;
    // const reviews = await Review.find({ serviceType: type });
    return res.json([]);
  } catch (err) {
    console.error('getReviewsByServiceType error:', err);
    return res.status(500).json({ error: err.message });
  }
};

const getAverageRating = async (req, res) => {
  try {
    // const avg = await Review.aggregate([...]);
    return res.json({ average: 0 });
  } catch (err) {
    console.error('getAverageRating error:', err);
    return res.status(500).json({ error: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    // await Review.findByIdAndDelete(id);
    return res.json({ message: `Deleted ${id}` });
  } catch (err) {
    console.error('deleteReview error:', err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  submitReview,
  getAllReviews,
  getRecentReviews,
  getReviewsByServiceType,
  getAverageRating,
  deleteReview,
};
