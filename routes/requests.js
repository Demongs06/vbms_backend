const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');
// Public routes
router.post('/', requestController.createRequest);
router.get('/:id', requestController.getRequestById);
// Protected admin routes
router.get('/', auth, requestController.getAllRequests);
router.put('/:id/accept', auth, requestController.acceptRequest);
router.put('/:id/assign', auth, requestController.assignStaff);
router.put('/:id/complete', auth, requestController.completeRequest);
router.put('/:id/cancel', auth, requestController.cancelRequest);
module.exports = router;
