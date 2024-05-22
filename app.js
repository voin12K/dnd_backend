const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Убедитесь, что ваш пароль закодирован правильно
const password = encodeURIComponent('12345');
const dbURI = `mongodb+srv://voin12k:${password}@cluster0.kbdn813.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('111hello world');
});

app.post('/auth/login', (req, res) => {
  console.log(req.body);

  const token = jwt.sign(
    {
      email: req.body.email,
      fullName: "vlad",
    },
    'secret123',
  );

  res.json({
    success: true,
    token,
  });
});

const PORT = process.env.PORT || 4444;

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server is running on port ${PORT}`);
});
