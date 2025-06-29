const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  problems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: {
      type: Number,
      default: 0
    },
    submissions: [{
      problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
      },
      status: String,
      submissionTime: Date,
      points: Number
    }]
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'ended'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

// Add index for efficient querying
contestSchema.index({ startTime: 1 });
contestSchema.index({ status: 1 });

// Virtual field for contest end time
contestSchema.virtual('endTime').get(function() {
  return new Date(this.startTime.getTime() + this.duration * 60000);
});

// Method to check if contest is active
contestSchema.methods.isActive = function() {
  const now = new Date();
  return now >= this.startTime && now <= this.endTime;
};

// Method to update contest status
contestSchema.methods.updateStatus = function() {
  const now = new Date();
  if (now < this.startTime) {
    this.status = 'upcoming';
  } else if (now <= this.endTime) {
    this.status = 'active';
  } else {
    this.status = 'ended';
  }
};

module.exports = mongoose.model('Contest', contestSchema);