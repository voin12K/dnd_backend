const express = require('express');
const jwt = require('jsonwebtoken');


const app = express();

app.use(express.json())

app.get('/', (req, res) => {
  res.send('111hello world');
});

app.post('/auth/login', (req, res) =>{
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
  })
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err); 
  }

  console.log('send OK')
});