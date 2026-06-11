// index.js (Root folder)
const appInsights = require('applicationinsights');

if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY).start();
}

const express = require('express');
const session = require('express-session');
const port = process.env.PORT || 8080;
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

// Health Check Endpoint
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    mongodb: dbStatus,
  });
});

// ─── THE CLEAN ROUTE MOUNTING ───
app.use('/', require('./routes/index1')); // Handles page views (/, /dashboard, etc.)
app.use('/api', require('./routes/api')); // Handles data actions (/api/register, /api/addtask)

// Global Exception Handlers
process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err);
  if (appInsights.defaultClient) {
    appInsights.defaultClient.trackException({ exception: err });
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection', reason);
  if (appInsights.defaultClient) {
    appInsights.defaultClient.trackException({ exception: typeof reason === 'object' ? reason : new Error(String(reason)) });
  }
});

app.listen(port, (err) => {
  if (err) console.log(`Error: ${err}`);
  console.log(`Yupp! Server is running cleanly on port ${port}`);
});
