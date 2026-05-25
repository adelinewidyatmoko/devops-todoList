const db = require('../config/mongoose');
const Dashboard = require('../models/dashboard');

module.exports.dashboard = function(req, res){

    Dashboard.find({})
    .then(function(data){
        const username = req.session && req.session.user ? req.session.user.name : "Guest";

        return res.render('dashboard', {
            title: "Dashboard",
            dashboard: data,
            username: username
        });

    })
    .catch(function(err){

        console.log('Error', err);

        return;

    });

}
