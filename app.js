const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err); 
  }

  console.log('send OK')
})