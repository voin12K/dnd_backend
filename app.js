import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import { registerValidation } from './validations/auth.js';
import bcrypt from 'bcrypt';
import User from './models/user.js';
import Room from './models/room.js';

const password = encodeURIComponent('12345');
const dbURI = `mongodb+srv://voin12k:${password}@cluster0.kbdn813.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

app.use(express.json());
app.use(cors());

const checkAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, 'secret123');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

app.post('/auth/register', registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { email, fullName, password, avatarUrl } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      fullName,
      avatarUrl,
      passwordHash: hash,
    });

    const savedUser = await newUser.save();

    res.status(201).json({ success: true, user: savedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error saving user', error: err });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
    }

    const token = jwt.sign(
      { email: user.email, fullName: user.fullName },
      'secret123',
      { expiresIn: '1h' }
    );

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

app.get('/auth/me', checkAuth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

app.post('/rooms/create', async (req, res) => {
  const {
    name,
    availableRaces,
    availableClasses,
    startLevel,
    startMoney,
    maxPlayers,
    language,
    description,
    isOpen,
  } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Room name is required' });
  }

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const newRoom = new Room({
    code,
    name,
    users: [],
    availableRaces,
    availableClasses,
    startLevel,
    startMoney,
    maxPlayers,
    language,
    description,
    isOpen,
  });

  try {
    const savedRoom = await newRoom.save();
    res.status(201).json({ success: true, room: savedRoom });
  } catch (err) {
    res.status(500).json({ message: 'Error creating room', error: err });
  }
});

app.post('/rooms/join', async (req, res) => {
  const { code, userId } = req.body;

  if (!code || !userId) {
      return res.status(400).json({ message: 'Room code and user ID are required' });
  }

  try {
      const room = await Room.findOne({ code });

      if (!room) {
          return res.status(404).json({ message: 'Room not found' });
      }

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (!room.isOpen && !room.users.includes(userId)) {
          return res.status(403).json({ message: 'Cannot join a closed room without an invitation' });
      }

      if (!room.users.includes(userId)) {
          room.users.push(userId);
          await room.save();
          console.log(`User ${userId} added to room ${code}`);
      } else {
          console.log(`User ${userId} already in room ${code}`);
      }

      res.json({ success: true, room });
  } catch (err) {
      console.error('Error joining room:', err);
      res.status(500).json({ message: 'Error joining room', error: err });
  }
});

app.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find().populate('users');
    res.json({ success: true, rooms });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving rooms list', error: err });
  }
});

app.get('/rooms/open', async (req, res) => {
  try {
    const openRooms = await Room.find({ isOpen: true }).populate('users');
    res.json({ success: true, rooms: openRooms });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving open rooms list', error: err });
  }
});

app.put('/rooms/:id', async (req, res) => {
  const {
    availableRaces,
    availableClasses,
    startLevel,
    startMoney,
    maxPlayers,
    language,
    description,
    isOpen,
  } = req.body;

  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.availableRaces = availableRaces || room.availableRaces;
    room.availableClasses = availableClasses || room.availableClasses;
    room.startLevel = startLevel || room.startLevel;
    room.startMoney = startMoney || room.startMoney;
    room.maxPlayers = maxPlayers || room.maxPlayers;
    room.language = language || room.language;
    room.description = description || room.description;
    room.isOpen = isOpen !== undefined ? isOpen : room.isOpen;

    const updatedRoom = await room.save();
    res.json({ success: true, room: updatedRoom });
  } catch (err) {
    res.status(500).json({ message: 'Error updating room', error: err });
  }
});

app.delete('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ success: true, message: 'Room successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting room', error: err });
  }
});

const PORT = process.env.PORT || 4444;
app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server is running on port ${PORT}`);
});
