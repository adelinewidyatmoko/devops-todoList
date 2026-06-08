jest.mock('../config/mongoose', () => ({}));
jest.mock('../models/dashboard', () => ({
  find: jest.fn(),
}));

const Dashboard = require('../models/dashboard');
const completedtaskController = require('./completedtaskController');

describe('completedtaskController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders completed tasks with the logged-in session username', async () => {
    const dashboardData = [{ task: 'Finish CI', completed: true }];
    const req = {
      session: {
        user: {
          name: 'Maria',
        },
      },
    };
    const res = {
      render: jest.fn(),
    };

    Dashboard.find.mockResolvedValue(dashboardData);

    completedtaskController.completedtask(req, res);
    await Promise.resolve();

    expect(Dashboard.find).toHaveBeenCalledWith({});
    expect(res.render).toHaveBeenCalledWith('completedtask', {
      title: 'Dashboard',
      username: 'Maria',
      dashboard: dashboardData,
    });
  });

  test('renders completed tasks with Guest when there is no session user', async () => {
    const dashboardData = [];
    const req = {};
    const res = {
      render: jest.fn(),
    };

    Dashboard.find.mockResolvedValue(dashboardData);

    completedtaskController.completedtask(req, res);
    await Promise.resolve();

    expect(res.render).toHaveBeenCalledWith('completedtask', {
      title: 'Dashboard',
      username: 'Guest',
      dashboard: dashboardData,
    });
  });
});
