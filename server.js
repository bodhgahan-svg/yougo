const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('YOUGO Backend Service Running Successfully!');
});

app.listen(PORT, () => {
  console.log(`YOUGO Server running on port ${PORT}`);
});
