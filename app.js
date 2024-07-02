
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import { registerValidation } from './validations/auth.js';
import bcrypt from 'bcrypt';
import User from './models/user.js';


const password = encodeURIComponent('12345');
const dbURI = `mongodb+srv://voin12k:${password}@cluster0.kbdn813.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


const app = express();

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello world');
});

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

app.post('/rooms/create', async (req, res) => {
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

    if (!room.users.includes(userId)) {
      room.users.push(userId);
      await room.save();
    }

    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ message: 'Error joining room', error: err });
  }
});

app.post('/createCharacter', async (req, res) => {
  try {
    const characterData = req.body;

    const requiredFields = ['name', 'lvl', 'exp', 'account', 'room', 'race', 'class', 'age', 'hp', 'hit_dice', 'max_hp', 'ac', 'initiative', 'speed', 'proficiency', 'playerName'];
    const missingFields = requiredFields.filter(field => !characterData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ message: 'Все обязательные поля должны быть заполнены', missingFields });
    }

    const newCharacter = await Character.create(characterData);
    res.status(201).json(newCharacter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 4444;
app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server is running on port ${PORT}`);
});