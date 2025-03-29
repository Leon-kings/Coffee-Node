const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// Subscribe route
router.post('/', subscriptionController.subscribe);

// Unsubscribe route
router.delete('/:email', subscriptionController.unsubscribe);

// Optional verification route
router.get('/verify/:token', subscriptionController.verifySubscription);

module.exports = router;