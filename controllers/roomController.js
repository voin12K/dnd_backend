import Room from '../models/room.js';

export const createRoom = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Room name is required' });
  }

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const newRoom = new Room({
    code,
    name,
    users: [],
  });

  try {
    const savedRoom = await newRoom.save();
    res.status(201).json({ success: true, room: savedRoom });
  } catch (err) {
    res.status(500).json({ message: 'Error creating room', error: err });
  }
};

export const joinRoom = async (req, res) => {
  const { code, userId } = req.body;

  if (!code || !userId) {
    return res.status(400).json({ message: 'Room code and user ID are required' });
  }

  try {
    const room = await Room.findOne({ code });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.users.includes(userId)) {
      room.users.push(userId);
      await room.save();
    }

    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ message: 'Error joining room', error: err });
  }
};
