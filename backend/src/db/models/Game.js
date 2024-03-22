module.exports = (sequelize, DataTypes) => {
    const Game = sequelize.define('Game', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
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
      position: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        defaultValue: [
          24, 22, 23, 25, 26, 23, 22, 24,
          22, 22, 22, 22, 22, 22, 22, 22,
          0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
          11, 11, 11, 11, 11, 11, 11, 11,
          14, 12, 13, 15, 16, 13, 12, 14,
        ]
      },
      turn: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'Turn must be an integer'
          }
        }
      },
      playerWhite: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'PlayerWhite must be an integer.'
          }
        }
      },
      playerWhiteTimeRemaining: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'PlayerWhite time must be an integer.'
          }
        }
      },
      playerBlack: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'PlayerBlack must be an integer.'
          }
        }
      },
      playerBlackTimeRemaining: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
  