jest.mock('../config/mongoose', () => ({}));
jest.mock('../models/dashboard', () => ({
    find: jest.fn()
}));

const Dashboard = require('../models/dashboard');
const dashboardController = require('./dashboardController');

describe('dashboardController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders dashboard with the logged-in session username', async () => {
        const dashboardData = [
            { task: 'Deploy app', categoryChoosed: 'work' }
        ];
        const req = {
            session: {
                user: {
                    name: 'Maria'
                }
            }
        };
        const res = {
            render: jest.fn()
        };

        Dashboard.find.mockResolvedValue(dashboardData);

        dashboardController.dashboard(req, res);
        await Promise.resolve();

        expect(Dashboard.find).toHaveBeenCalledWith({});
        expect(res.render).toHaveBeenCalledWith('dashboard', {
            title: 'Dashboard',
            dashboard: dashboardData,
            username: 'Maria'
        });
    });

    test('renders dashboard with Guest when there is no session user', async () => {
        const dashboardData = [];
        const req = {};
        const res = {
            render: jest.fn()
        };

        Dashboard.find.mockResolvedValue(dashboardData);

        dashboardController.dashboard(req, res);
        await Promise.resolve();

        expect(res.render).toHaveBeenCalledWith('dashboard', {
            title: 'Dashboard',
            dashboard: dashboardData,
            username: 'Guest'
        });
    });
});
