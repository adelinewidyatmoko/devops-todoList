const path = require('path')

require('dotenv').config({path: path.resolve(__dirname, '../.env')});

// require mongoose
const mongoose = require('mongoose');
// connect to database
const dbUrl = String(process.env.MONGODB_URL || '');

console.log("checking the database connection", typeof dbUrl)
// acquire the connection (to check if it is successful)
mongoose.connect(dbUrl, {
    ssl : true, 
    authMechanism : 'SCRAM-SHA-1'
})
.then(()=> console.log("Connected to azure cosmos DB successfully!"))
.catch(err => console.error("Database connection error", err));

module.exports = mongoose.connection;