const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  avatarUrl: String,
  passwordHash: { type: String, required: true },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
});

module.exports = mongoose.model('User', userSchema);
