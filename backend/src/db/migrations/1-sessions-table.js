const { Sequelize } = require("sequelize");

async function up({ context: queryInterface }) {
  await queryInterface.createTable("Sessions", {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Unnamed Grand Master",
    },
    expiresAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable("Sessions");
}

module.exports = { up, down };
