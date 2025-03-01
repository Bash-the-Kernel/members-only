const { Sequelize } = require('sequelize');

// Load environment variables from .env file (if you are using dotenv)
require('dotenv').config();

// Create a new Sequelize instance using the DATABASE_URL environment variable
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log, // Enable logging to see the connection process
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    process.exit(0); // Exit the process with success code
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1); // Exit the process with error code
  });