const express = require('express');
const app = express();

app.get('/api/data', (req, res) => {
  res.send('Data from Backend');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
