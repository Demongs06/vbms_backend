const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const auth = require('../middleware/auth');
// All staff routes require authentication
router.use(auth);
router.post('/', staffController.addStaff);
router.get('/', staffController.getAllStaff);
router.get('/drivers', staffController.getDrivers);
router.get('/mechanics', staffController.getMechanics);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', staffController.removeStaff);
router.put('/:id/availability', staffController.toggleAvailability);
module.exports = router;
