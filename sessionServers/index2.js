const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const port3 = process.env.PORT3 || 5007;
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize session objects/store
const sessions = [];

// Check for correct user login
app.post('/login', (req, res) => {
  const { username, passcode } = req.body;
  if (username !== 'admin' || passcode !== 'admin') {
    return res.status(401).send('Invalid username or password');
  }
  // If the user is logged in, initialize a session
  const sessionId = uuidv4();
  sessions[sessionId] = { username, userId: 1 };
  // Set the session ID as a cookie
  res.cookie('sessionId', sessionId);
  res.status(200).send('Success');
});


// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId && sessions[sessionId]) {
    req.userSession = sessions[sessionId];
    next();
  } else {
    res.sendStatus(401);
  }
};

// If logged in, display todos info/page
app.get('/todos', isLoggedIn, (req, res) => {
  const userSession = req.userSession;
  const userId = userSession.userId;
  res.send([
    {
      id: 1,
      title: 'mbunge',
      userId,
    },
  ]);
});

app.listen(port3, () => {
  console.log(`Server is running on port ${port3}`);
});
