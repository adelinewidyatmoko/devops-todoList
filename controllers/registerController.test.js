const registerController = require('./registerController');

describe('registerController', () => {
  test('renders the register page with the title', () => {
    const req = {};
    const res = {
      render: jest.fn(),
    };

    registerController.register(req, res);

    expect(res.render).toHaveBeenCalledWith('register', {
      title: 'register',
    });
  });

  test('renders the login page with the title', () => {
    const req = {};
    const res = {
      render: jest.fn(),
    };

    registerController.login(req, res);

    expect(res.render).toHaveBeenCalledWith('login', {
      title: 'login',
    });
  });
});
