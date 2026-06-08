jest.mock('bcrypt');

jest.mock('../models/register', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock('../models/dashboard', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

const bcrypt = require('bcrypt');
const User = require('../models/register');
const Dashboard = require('../models/dashboard');
const router = require('./api');

bcrypt.compare = jest.fn();
bcrypt.hash = jest.fn();

function getRouteHandler(path, method) {
  const layer = router.stack.find(function (routeLayer) {
    return (
      routeLayer.route &&
      routeLayer.route.path === path &&
      routeLayer.route.methods[method]
    );
  });

  return layer.route.stack[0].handle;
}

describe('api routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('successful login saves the user in session and redirects to dashboard', async () => {
    const loginHandler = getRouteHandler('/login', 'post');
    const user = {
      _id: 'user-1',
      name: 'Maria',
      email: 'maria@example.com',
      password: 'hashed-password',
    };
    const req = {
      body: {
        email: 'maria@example.com',
        password: 'secret',
      },
      session: {},
    };
    const res = {
      redirect: jest.fn(),
      send: jest.fn(),
    };

    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);

    await loginHandler(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      email: 'maria@example.com',
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('secret', 'hashed-password');
    expect(req.session.user).toEqual({
      id: 'user-1',
      name: 'Maria',
      email: 'maria@example.com',
    });
    expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    expect(res.send).not.toHaveBeenCalled();
  });

  test('delete task route deletes by id and redirects back', async () => {
    const deleteHandler = getRouteHandler('/delete-task', 'get');
    const req = {
      query: {
        id: 'task-1',
      },
    };
    const res = {
      redirect: jest.fn(),
    };

    Dashboard.findByIdAndDelete.mockResolvedValue({
      _id: 'task-1',
    });

    deleteHandler(req, res);
    await Promise.resolve();

    expect(Dashboard.findByIdAndDelete).toHaveBeenCalledWith('task-1');
    expect(res.redirect).toHaveBeenCalledWith('back');
  });

  test('google calendar route redirects to a prefilled calendar event', async () => {
    const calendarHandler = getRouteHandler('/google-calendar', 'get');
    const req = {
      query: {
        id: 'task-1',
      },
    };
    const res = {
      redirect: jest.fn(),
    };

    Dashboard.findById.mockResolvedValue({
      task: 'DevOps demo',
      description: 'Show the pipeline tests',
      date: '2026-05-25',
      time: '10:30',
    });

    await calendarHandler(req, res);

    expect(Dashboard.findById).toHaveBeenCalledWith('task-1');
    expect(res.redirect).toHaveBeenCalledWith(
      expect.stringContaining('https://calendar.google.com/calendar/render?')
    );
    expect(res.redirect).toHaveBeenCalledWith(
      expect.stringContaining('action=TEMPLATE')
    );
    expect(res.redirect).toHaveBeenCalledWith(
      expect.stringContaining('text=DevOps+demo')
    );
    expect(res.redirect).toHaveBeenCalledWith(
      expect.stringContaining('dates=20260525T103000%2F20260525T113000')
    );
  });
});
