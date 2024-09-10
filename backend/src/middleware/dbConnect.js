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

  const pendingMigrations = await umzug.pending();
  console.log("Pending Migrations: ", pendingMigrations);

  // await umzug.down({ to: 0 });
  await umzug.up();
  console.log("All migrations have been run.");
};

const dbConnect = async (retries = 5, delay = 10000) => {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");

      await runMigrations();
      return;
    } catch (error) {
      console.error(`Unable to connect to the database: ${error.message}`);

      retries -= 1;
      if (retries === 0) {
        console.error(
          "Max retries reached. Unable to connect to the database."
        );
        return;
      }

      console.log(
        `Retrying in ${delay / 1000} seconds... (${retries} attempts left)`
      );
      await new Promise((res) => setTimeout(res, delay)); // Wait for the delay period
    }
  }
};

// Function to check the database connection
const checkDatabaseConnection = async () => {
  try {
    // Run a simple query to check if the database connection is alive
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
};

module.exports = { dbConnect, checkDatabaseConnection };
