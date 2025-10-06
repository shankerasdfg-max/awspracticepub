const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Node.js on GKE via Jenkins CI/CD!');
});

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
