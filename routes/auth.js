const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// Admin login
router.post('/login', authController.login);
// Admin logout
router.post('/logout', authController.logout);
module.exports = router;
