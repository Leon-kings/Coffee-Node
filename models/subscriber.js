const mongoose = require('mongoose');
const { isEmail } = require('validator');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate emails
subscriberSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Subscriber', subscriberSchema);