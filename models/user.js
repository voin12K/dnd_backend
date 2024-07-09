import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  avatarUrl: String,
  passwordHash: { type: String, required: true },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
  characters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }] 
});

const User = mongoose.model('User', userSchema);

export default User;
