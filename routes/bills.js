const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const auth = require('../middleware/auth');
router.post('/', auth, billController.generateBill);
router.get('/', auth, billController.getAllBills);
router.get('/:id', billController.getBillById);
router.put('/:id/pay', billController.markAsPaid);
module.exports = router;
