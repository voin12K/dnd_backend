import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  availableRaces: [String],
  availableClasses: [String],
  startLevel: Number,
  startMoney: Number,
  maxPlayers: Number,
  language: String,
  description: String,
  isOpen: Boolean,
});

const Room = mongoose.model('Room', RoomSchema);
export default Room; 
