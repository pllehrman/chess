const { Sequelize } = require('sequelize');

console.log(process.env.DATABASE_PASSWORD)

// Database connection configuration
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'db',
    database: 'mydatabase',
    username: 'myuser',
    password: process.env.DATABASE_PASSWORD,
  });
  
// Helper function to test database connection
const dbConnect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = dbConnect;