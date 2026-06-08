// api.integration.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Import your actual router and models
const apiRouter = require('./api');
const User = require('../models/register');
const Dashboard = require('../models/dashboard');
const bcrypt = require('bcrypt');

// 1. Setup a fake Express app just for testing
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Fake session middleware (since your /login route uses req.session)
app.use((req, res, next) => {
  req.session = {};
  next();
});

// Mount your routes
app.use('/', apiRouter);

describe('API Integration Tests', () => {
  let mongoServer;

  // 2. Start the in-memory MongoDB
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  // 3. Disconnect and stop the database
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // 4. Clear out the database after EVERY test
  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  });

  // --- REGISTRATION & LOGIN TESTS ---

  test('POST /register should successfully hash password and save user to DB', async () => {
    const response = await request(app).post('/register').send({
      name: 'Alice',
      lastName: 'Smith',
      phone: '1234567890',
      email: 'alice@example.com',
      password: 'superSecretPassword123',
    });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');

    const savedUser = await User.findOne({ email: 'alice@example.com' });
    expect(savedUser).toBeTruthy();
    expect(savedUser.name).toBe('Alice');

    const isPasswordHashedCorectly = await bcrypt.compare(
      'superSecretPassword123',
      savedUser.password
    );
    expect(isPasswordHashedCorectly).toBe(true);
  });

  test('POST /login should authenticate a user and redirect to dashboard', async () => {
    // Arrange: Create a user in the test DB with ALL REQUIRED schema fields
    const hashedPassword = await bcrypt.hash('secret123', 10);
    await User.create({
      name: 'Bob',
      lastName: 'Builder', // <-- Required!
      phone: '0987654321', // <-- Required!
      email: 'bob@example.com',
      password: hashedPassword,
    });

    // Act
    const response = await request(app).post('/login').send({
      email: 'bob@example.com',
      password: 'secret123',
    });

    // Assert
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/dashboard');
  });

  test('POST /login should reject wrong password', async () => {
    const hashedPassword = await bcrypt.hash('secret123', 10);
    await User.create({
      name: 'Bob',
      lastName: 'Builder', // <-- Required!
      phone: '0987654321', // <-- Required!
      email: 'bob@example.com',
      password: hashedPassword,
    });

    const response = await request(app).post('/login').send({
      email: 'bob@example.com',
      password: 'wrongpassword',
    });

    expect(response.text).toBe('Wrong password');
  });

  // --- TASK MODULE TESTS ---

  test('POST /addtask should save a new task to the database', async () => {
    const response = await request(app).post('/addtask').send({
      task: 'Integration Test Task',
      date: '2026-10-10',
      description: 'Testing the DB connection',
      time: '14:00',
      categoryChoosed: 'Work',
    });

    expect(response.status).toBe(302);

    const savedTask = await Dashboard.findOne({
      task: 'Integration Test Task',
    });
    expect(savedTask).toBeTruthy();
    expect(savedTask.description).toBe('Testing the DB connection');
    expect(savedTask.date).toBe('2026-10-10');
  });

  test('GET /complete-task should correctly update task completed status to true', async () => {
    // Arrange: Create a task in the DB with ALL REQUIRED schema fields
    const newTask = await Dashboard.create({
      task: 'Task to Complete',
      date: '2026-12-01', // <-- Required!
      categoryChoosed: 'Work', // <-- Required!
      description: 'Needs completing',
      completed: false,
    });

    // Act
    const response = await request(app).get(`/complete-task?id=${newTask._id}`);

    // Assert
    expect(response.status).toBe(302); // Expecting redirect back

    // Verify from Mongo it updated
    const updatedTask = await Dashboard.findById(newTask._id);
    expect(updatedTask.completed).toBe(true);
  });

  test('GET /delete-task should permanently remove task from database', async () => {
    // Arrange: Create a task to delete
    const newTask = await Dashboard.create({
      task: 'Task to Delete',
      date: '2026-12-01', // <-- Required!
      categoryChoosed: 'Personal', // <-- Required!
      description: 'Needs deleting',
    });

    // Act
    const response = await request(app).get(`/delete-task?id=${newTask._id}`);

    // Assert
    expect(response.status).toBe(302);

    // Verify from Mongo it represents null (deleted)
    const deletedTask = await Dashboard.findById(newTask._id);
    expect(deletedTask).toBeNull();
  });

  test('GET /google-calendar should fetch the task and generate correct Google link', async () => {
    // Arrange
    const newTask = await Dashboard.create({
      task: 'Calendar Event',
      date: '2026-10-15', // <-- Required!
      time: '09:00',
      categoryChoosed: 'Shopping', // <-- Required!
      description: 'Buy groceries',
    });

    // Act
    const response = await request(app).get(
      `/google-calendar?id=${newTask._id}`
    );

    // Assert
    expect(response.status).toBe(302);
    // Ensure the redirect params are generated properly out of the API
    expect(response.headers.location).toContain(
      'https://calendar.google.com/calendar/render'
    );
    expect(response.headers.location).toContain('action=TEMPLATE');
    expect(response.headers.location).toContain('text=Calendar+Event');
  });
});
