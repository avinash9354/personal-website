const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true
  },
  subject: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Please provide message'],
    trim: true
  },
  projectType: {
    type: String,
    enum: ['web', 'mobile', 'ai', 'consulting', 'other']
  },
  budget: String,
  timeline: String,
  status: {
    type: String,
    enum: ['unread', 'read', 'replied'],
    default: 'unread'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attachments: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);