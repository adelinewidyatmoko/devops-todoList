const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// require mongoose
const mongoose = require('mongoose');
// connect to database
const dbUrl = String(process.env.MONGODB_URL || '');

console.log('checking the database connection', typeof dbUrl);
// acquire the connection (to check if it is successful)
mongoose
  .connect(dbUrl, {
    // Cosmos DB specific recommended settings
    tls: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
  })
  .then(() => console.log('Connected to Cosmos DB!'))
  .catch((err) => console.error('Database connection error:', err));

module.exports = mongoose.connection;
