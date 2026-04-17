/**
 * User Model
 * Stores user profile, role, and search preferences
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ['Student', 'Farmer', 'Business Owner', 'General Citizen'],
    default: 'General Citizen'
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  // Track previously searched terms for recommendation engine
  searchHistory: [{ type: String }],
  // Schemes the user has viewed
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' }],
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
