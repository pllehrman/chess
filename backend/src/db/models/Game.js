module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define(
    "Game",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        // This type refers to computer engine games vs. person-to-person games
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pvc",
      },
      difficulty: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: "Game type must be an integer value.",
          },
        },
      },
      winner: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fen: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:
          "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Starting position in FEN
      },
      playerWhiteSession: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Sessions", // References the Session model
          key: "id",
        },
        onDelete: "CASCADE",
        validate: {
          is: {
            args: /^[a-zA-Z0-9]+$/, // Example regex for alphanumeric strings
            msg: "PlayerWhiteSession must be a valid string.",
          },
        },
      },
      initialTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      playerWhiteTimeRemaining: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: "PlayerWhite time must be an integer.",
          },
        },
      },
      playerBlackSession: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Sessions", // References the Session model
          key: "id",
        },
        onDelete: "CASCADE",
        validate: {
          is: {
            args: /^[a-zA-Z0-9]+$/, // Example regex for alphanumeric strings
            msg: "PlayerWhiteSession must be a valid string.",
          },
        },
      },
      playerBlackTimeRemaining: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: "PlayerBlack time must be an integer.",
          },
        },
      },
      timeIncrement: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "TimeIncrement must be an integer.",
          },
        },
      },
    },
    {
      timestamps: true,
    }
  );

  Game.associate = function (models) {
    Game.belongsTo(models.Session, {
      foreignKey: "playerWhiteSession",
      as: "whiteSession",
      onDelete: "CASCADE",
    });
    Game.belongsTo(models.Session, {
      foreignKey: "playerBlackSession",
      as: "blackSession",
      onDelete: "CASCADE",
    });
  };

  return Game;
};
