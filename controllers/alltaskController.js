const db = require('../config/mongoose');
const Dashboard = require('../models/dashboard');

module.exports.alltask = function(req, res){
    Dashboard.find({})
    .then(function(data){
        const username = req.session && req.session.user ? req.session.user.name : "Guest";

        return res.render('alltask', {
            title: "Dashboard",
            username: username,
            dashboard: data
        });
    })
    .catch(function(err){
        console.log('Error', err);
        return;
    });
}
