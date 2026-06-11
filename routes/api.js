// routes/api.js
const express = require('express');
const router = express.Router();
const appInsights = require('applicationinsights');

// Import the schemas right here where they are used
const User = require('../models/register');
const Dashboard = require('../models/dashboard');

// 1. User Registration API
const bcrypt = require('bcrypt');

function compactDate(dateValue) {
  return String(dateValue || '').replace(/-/g, '');
}

function addOneDay(dateValue) {
  const [year, month, day] = String(dateValue).split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + 1));
  return date.toISOString().slice(0, 10);
}

function formatGoogleDateTime(dateValue, timeValue, hoursToAdd = 0) {
  const [year, month, day] = String(dateValue).split('-').map(Number);
  const [hour, minute] = String(timeValue || '09:00')
    .split(':')
    .map(Number);
  const date = new Date(
    Date.UTC(year, month - 1, day, hour + hoursToAdd, minute || 0)
  );

  const datePart = [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('');

  const timePart = [
    String(date.getUTCHours()).padStart(2, '0'),
    String(date.getUTCMinutes()).padStart(2, '0'),
    '00',
  ].join('');

  return `${datePart}T${timePart}`;
}

function compactNextDate(dateValue) {
  return compactDate(addOneDay(dateValue));
}

function getGoogleCalendarDates(task) {
  if (!task.time) {
    return `${compactDate(task.date)}/${compactNextDate(task.date)}`;
  }

  return `${formatGoogleDateTime(task.date, task.time)}/${formatGoogleDateTime(task.date, task.time, 1)}`;
}

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log('HASH:', hashedPassword);

    const user = await User.create({
      name: req.body.name,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: hashedPassword,
    });

    console.log('Successfully Created user!', user);

    if (appInsights.defaultClient) {
      appInsights.defaultClient.trackEvent({
        name: 'RegisterSuccess',
        properties: { email: req.body.email },
      });
    }

    res.redirect('/login');
  } catch (err) {
    console.log(err);

    if (appInsights.defaultClient) {
      appInsights.defaultClient.trackEvent({
        name: 'RegisterFailure',
        properties: { email: req.body.email, error: err.message },
      });
      appInsights.defaultClient.trackException({ exception: err });
    }

    res.send('Register failed');
  }
});

router.get('/allusers', async (req, res) => {
  const users = await User.find();

  console.log(users);

  res.send(users);
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      if (appInsights.defaultClient) {
        appInsights.defaultClient.trackEvent({
          name: 'LoginFailure',
          properties: { email, reason: 'user_not_found' },
        });
      }
      return res.send('User not found');
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      if (appInsights.defaultClient) {
        appInsights.defaultClient.trackEvent({
          name: 'LoginFailure',
          properties: { email, reason: 'wrong_password' },
        });
      }
      return res.send('Wrong password');
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    if (appInsights.defaultClient) {
      appInsights.defaultClient.trackEvent({
        name: 'LoginSuccess',
        properties: { email },
      });
    }

    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);

    if (appInsights.defaultClient) {
      appInsights.defaultClient.trackEvent({
        name: 'LoginFailure',
        properties: {
          email: req.body.email,
          error: err.message,
          reason: 'exception',
        },
      });
      appInsights.defaultClient.trackException({ exception: err });
    }

    res.send('Login failed');
  }
});

// 2. Add Task API
router.post('/addtask', function (req, res) {
  Dashboard.create({
    task: req.body.task,
    date: req.body.date,
    description: req.body.description,
    time: req.body.time,
    categoryChoosed: req.body.categoryChoosed,
  })
    .then((newTask) => {
      console.log('Successfully Created Task!', newTask);
      if (appInsights.defaultClient) {
        appInsights.defaultClient.trackEvent({
          name: 'TaskCreated',
          properties: {
            category: req.body.categoryChoosed,
            taskId: String(newTask._id),
          },
        });
      }
      res.redirect('back');
    })
    .catch((err) => {
      console.error('Error Creating Task!!', err);
      if (appInsights.defaultClient) {
        appInsights.defaultClient.trackException({ exception: err });
      }
      res.redirect('back');
    });
});

// 3. Complete Task API
router.get('/complete-task', function (req, res) {
  let id = req.query.id;
  Dashboard.findByIdAndUpdate(id, { completed: true })
    .then((newTask) => {
      console.log('Successfully Completed Task!', newTask);
      if (appInsights.defaultClient) {
        appInsights.defaultClient.trackEvent({
          name: 'TaskCompleted',
          properties: { taskId: id },
        });
      }
      res.redirect('back');
    })
    .catch((err) => {
      console.error('Error Completing Task!!', err);
      if (appInsights.defaultClient) {
        appInsights.defaultClient.trackException({ exception: err });
      }
      res.redirect('back');
    });
});

// 4. Google Calendar API
router.get('/google-calendar', async function (req, res) {
  try {
    const task = await Dashboard.findById(req.query.id);

    if (!task) {
      return res.redirect('back');
    }

    const calendarParams = new URLSearchParams({
      action: 'TEMPLATE',
      text: task.task,
      details: task.description || '',
      dates: getGoogleCalendarDates(task),
      ctz: 'Asia/Makassar',
    });

    return res.redirect(
      `https://calendar.google.com/calendar/render?${calendarParams.toString()}`
    );
  } catch (err) {
    console.error('Error Opening Google Calendar!!', err);
    return res.redirect('back');
  }
});

// 5. Delete Task API
router.get('/delete-task', function (req, res) {
  let id = req.query.id;
  Dashboard.findByIdAndDelete(id)
    .then((newTask) => {
      console.log('Successfully Deleted Task!', newTask);
      if (appInsights.defaultClient) {
        appInsights.defaultClient.trackEvent({
          name: 'TaskDeleted',
          properties: { taskId: id },
        });
      }
      res.redirect('back');
    })
    .catch((err) => {
      console.error('Error Deleting Task!!', err);
      if (appInsights.defaultClient) {
        appInsights.defaultClient.trackException({ exception: err });
      }
      res.redirect('back');
    });
});

module.exports = router;
