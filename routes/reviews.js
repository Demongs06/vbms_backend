const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Submit review
router.post('/', reviewController.submitReview);

// Get all reviews
router.get('/', reviewController.getAllReviews);

// Get recent reviews
router.get('/recent', reviewController.getRecentReviews);

// Get reviews by service type
router.get('/service-type', reviewController.getReviewsByServiceType);

// Get average rating
router.get('/stats/average', reviewController.getAverageRating);

// Delete review (admin only)
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
