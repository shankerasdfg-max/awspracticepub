// app.js
const express = require('express');
const app = express();
const port = 80;

// Middleware (to parse JSON request body)
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Hello, Node.js App is running 🚀');
});

// Example route
app.get('/about', (req, res) => {
  res.send('This is a basic Node.js application with Express');
});

// POST example
app.post('/data', (req, res) => {
  const data = req.body;
  res.json({ message: 'Data received', data });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
