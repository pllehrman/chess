"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Games", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "Game type must be an integer value",
          },
        },
      },
      winner: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: {
          isInt: {
            msg: "Winner must be an integer",
          },
        },
      },
      fen: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:
          "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Starting position in FEN
      },
      playerWhiteSession: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: "Sessions", // Name of the referenced table
          key: "id", // Column in the Sessions table to reference
        },
        onDelete: "CASCADE", // Cascade delete when the session is deleted
        validate: {
          is: {
            args: /^[a-zA-Z0-9]+$/, // Example regex for alphanumeric strings
            msg: "PlayerWhiteSession must be a valid string.",
          },
        },
      },
      playerWhiteTimeRemaining: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: "PlayerWhite time must be an integer.",
          },
        },
      },
      playerBlackSession: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: "Sessions", // Name of the referenced table
          key: "id", // Column in the Sessions table to reference
        },
        onDelete: "CASCADE", // Cascade delete when the session is deleted
        validate: {
          is: {
            args: /^[a-zA-Z0-9]+$/, // Example regex for alphanumeric strings
            msg: "PlayerWhiteSession must be a valid string.",
          },
        },
      },
      playerBlackTimeRemaining: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: "PlayerBlack time must be an integer.",
          },
        },
      },
      timeIncrement: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "TimeIncrement must be an integer.",
          },
        },
      },
      numPlayers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "num_players must be an integer.",
          },
        },
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

    // Add indexes
    await queryInterface.addIndex("Games", ["playerWhiteSession"]);
    await queryInterface.addIndex("Games", ["playerBlackSession"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Games");
  },
};
