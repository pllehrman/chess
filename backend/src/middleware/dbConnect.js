const { Sequelize } = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");
const dbConfig = require("../db/config/config.js");
const path = require("path");

const NODE_ENV = process.env.NODE_ENV || "development";
const dbENV = dbConfig[NODE_ENV];

const sequelize = new Sequelize({
  dialect: dbENV.dialect,
  host: dbENV.host,
  port: dbENV.port,
  database: dbENV.database,
  username: dbENV.username,
  password: dbENV.password,
  logging: dbENV.logging,
});

// Helper function to run migrations
const runMigrations = async () => {
  const umzug = new Umzug({
    migrations: {
      glob: path.resolve(__dirname, "../db/migrations/*.js"),
    },
    storage: new SequelizeStorage({ sequelize }),
    context: sequelize.getQueryInterface(),
    logger: console,
  });

  const pendingMigrations = await umzug.pending();
  if (pendingMigrations.length > 0) {
    await umzug.up();
  }
  // await umzug.down({ to: 0 });
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
