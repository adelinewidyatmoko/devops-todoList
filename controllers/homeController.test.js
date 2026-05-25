const homeController = require('./homeController');

describe('homeController', () => {
    test('renders the home page with the title', () => {
        const req = {};
        const res = {
            render: jest.fn()
        };

        homeController.home(req, res);

        expect(res.render).toHaveBeenCalledWith('home', {
            title: 'Todos'
        });
    });
});
