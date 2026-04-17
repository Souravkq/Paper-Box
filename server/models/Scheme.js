/**
 * Scheme Model
 * Represents a government subsidy or scheme
 */
const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Education', 'Agriculture', 'Business', 'Health', 'Housing', 'Women', 'SC/ST', 'General'],
    required: true
  },
  // Which user types benefit most from this scheme
  targetUsers: [{
    type: String,
    enum: ['Student', 'Farmer', 'Business Owner', 'General Citizen']
  }],
  eligibility: { type: String },
  benefits: { type: String },
  applicationProcess: { type: String },
  deadline: { type: Date },
  ministry: { type: String },
  link: { type: String },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Text index for smart search
schemeSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Scheme', schemeSchema);
