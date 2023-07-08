const express = require('express');
const app = express();
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const port3 = process.env.PORT3 || 5007;
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

// Initialize session objects
const sessions = {};

// Check for correct user login
app.post('/login', (req, res) => {
  const { username, passcode } = req.body;
  if (username !== 'admin' || passcode !== 'admin') {
    return res.status(401).send('Invalid username or password');
  }
  // If user is logged in, initialize a session
  const sessionId = uuidv4();
  sessions[sessionId] = { username, userId: 1 };
  // Set cookie header and send key-value pair
  res.set('Set-Cookie', `sessionId=${sessionId}`);
  res.status(200).send('Success');
});

// Logout route
app.post('/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;
  delete sessions[sessionId];
  // Delete the session cookie
  res.set(
    'Set-Cookie',
    `sessionId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; HttpOnly`
  );
  res.send('Success');
});

// Check if the user is logged in
const isLoggedIn = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId && sessionId in sessions) {
    next();
  } else {
    res.sendStatus(403);
  }
};

// If logged in, display todos info/page
app.get('/todos', isLoggedIn, (req, res) => {
  const sessionId = req.cookies.sessionId;
  const userSession = sessions[sessionId];
  if (!userSession) {
    return res.status(401).send('Invalid token');
  }
  // Create userId
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
