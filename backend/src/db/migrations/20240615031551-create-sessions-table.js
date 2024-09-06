"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Sessions", {
      id: {
        type: Sequelize.STRING, // Using STRING instead of INTEGER for session ID
        allowNull: false,
        primaryKey: true, // Session ID should be the primary key
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Sessions");
  },
};
