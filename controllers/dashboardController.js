const db = require('../config/mongoose');
const Dashboard = require('../models/dashboard');
const User = require('../models/register');

module.exports.dashboard = function(req, res){
    const data = Dashboard.find({})
    .then(function(data){
        User.findOne()
        .then(function(user){
            if (!user) {
                return res.status(404).send('No user found. Please register first.');
            }
        return res.render('dashboard', {
            title: "Dashboard",
            name: user.name,
            dashboard: data
        });
    })
    })
    .catch(function(err){
        console.log('Error', err);
        return;
    });
}