const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide project title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide project description']
  },
  longDescription: String,
  techStack: [String],
  githubLink: String,
  liveLink: String,
  image: String,
  images: [String],
  category: {
    type: String,
    enum: ['web', 'mobile', 'ai', 'other'],
    default: 'web'
  },
  featured: {
    type: Boolean,
    default: false
  },
  startDate: Date,
  endDate: Date,
  achievements: [String],
  client: String,
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);