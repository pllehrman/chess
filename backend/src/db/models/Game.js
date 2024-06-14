module.exports = (sequelize, DataTypes) => {
    const Game = sequelize.define('Game', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      type: { // This type refers to computer engine games vs. person to person games
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: 'Game type must be an integer value'
          }
        }
      },
      winner: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: {
          isInt: {
            msg: 'Winner must be an integer'
          }
        }
      },
      fen: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' // Starting position in FEN
      },
      turn: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "white",
      },
      playerWhite: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: 'PlayerWhite must be an integer.'
          }
        }
      },
      playerWhiteTimeRemaining: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: 'PlayerWhite time must be an integer.'
          }
        }
      },
      playerBlack: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: 'PlayerBlack must be an integer.'
          }
        }
      },
      playerBlackTimeRemaining: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: 'PlayerBlack time must be an integer.'
          }
        }
      }
    }, {
      timestamps: true,
    });
        
    return Game;
  };
  