const Dashboard = require('../models/dashboard');

module.exports.completedtask = function (req, res) {
  Dashboard.find({})
    .then(function (data) {
      const username =
        req.session && req.session.user ? req.session.user.name : 'Guest';

      return res.render('completedtask', {
        title: 'Dashboard',
        username: username,
        dashboard: data,
      });
    })
    .catch(function (err) {
      console.log('Error', err);
      return;
    });
};
