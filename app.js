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

const PORT = process.env.PORT || 4444;

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server is running on port ${PORT}`);
});
