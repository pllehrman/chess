const { Sequelize } = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

// Helper function to run migrations
const runMigrations = async () => {
  const umzug = new Umzug({
    migrations: {
      glob: path.resolve(__dirname, "../db/migrations/*.js"), // Use absolute path
    }, // Adjust this path to where your migrations are stored
    storage: new SequelizeStorage({ sequelize }), // Use Sequelize as migration storage
    context: sequelize.getQueryInterface(),
    logger: console, // Optional: logs migration status to console
  });

  // const pendingMigrations = await umzug.pending();
  // console.log("Pending Migrations: ", pendingMigrations);

  // await umzug.down({ to: 0 });
  await umzug.up();
  console.log("All migrations have been run.");
};

// Helper function to test database connection and run migrations
const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Run migrations after successful connection
    await runMigrations();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = dbConnect;
