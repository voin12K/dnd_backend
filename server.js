import app from './app.js';

const PORT = process.env.PORT || 4444;
app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server is running on port ${PORT}`);
});
