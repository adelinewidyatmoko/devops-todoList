// index.js (Root folder)
const express = require('express');
const session = require('express-session');
const port = 4000;
const path = require('path');

// Connections
require('./config/mongoose');

const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'todo-list-session-secret',
    resave: false,
    saveUninitialized: false,
  })
);

// ─── THE CLEAN ROUTE MOUNTING ───
app.use('/', require('./routes/index1')); // Handles page views (/, /dashboard, etc.)
app.use('/api', require('./routes/api')); // Handles data actions (/api/register, /api/addtask)

app.listen(port, (err) => {
  if (err) console.log(`Error: ${err}`);
  console.log(`Yupp! Server is running cleanly on port ${port}`);
});
