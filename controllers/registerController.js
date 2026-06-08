module.exports.register = function (req, res) {
  return res.render('register', {
    title: 'register',
  });
};

module.exports.login = function (req, res) {
  return res.render('login', {
    title: 'login',
  });
};
