jest.mock('../config/mongoose', () => ({}));
jest.mock('../models/dashboard', () => ({
    find: jest.fn()
}));

const Dashboard = require('../models/dashboard');
const alltaskController = require('./alltaskController');

describe('alltaskController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all tasks with the logged-in session username', async () => {
        const dashboardData = [
            { task: 'Write tests', categoryChoosed: 'work' }
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

        alltaskController.alltask(req, res);
        await Promise.resolve();

        expect(Dashboard.find).toHaveBeenCalledWith({});
        expect(res.render).toHaveBeenCalledWith('alltask', {
            title: 'Dashboard',
            username: 'Maria',
            dashboard: dashboardData
        });
    });

    test('renders all tasks with Guest when there is no session user', async () => {
        const dashboardData = [];
        const req = {};
        const res = {
            render: jest.fn()
        };

        Dashboard.find.mockResolvedValue(dashboardData);

        alltaskController.alltask(req, res);
        await Promise.resolve();

        expect(res.render).toHaveBeenCalledWith('alltask', {
            title: 'Dashboard',
            username: 'Guest',
            dashboard: dashboardData
        });
    });
});
