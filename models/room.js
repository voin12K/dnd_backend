import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    name: { type: String },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    availableRaces: [{ type: String }],
    availableClasses: [{ type: String }],
    startLevel: { type: Number, default: 1 },
    startMoney: { type: Number, default: 100 },
    maxPlayers: { type: Number, default: 4 },
    language: { type: String, default: "English" },
    description: { type: String, default: "" },
    isOpen: { type: Boolean, default: true }
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
