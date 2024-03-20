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
            defaultValue: null
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
            ],
            validate: {
              isValidPosition(value) {
                if (value.length !== 64) {
                  throw new Error('Position array must contain 64 elements');
                }
              }
            }
          },
          turn: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          playerWhite: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          playerBlack: {
            type: DataTypes.INTEGER,
            allowNull: false
          }
        }, {
            timestamps: true, // Enable automatic timestamps
            sequelize,
            modelName: 'Game'
          });
        
        return Game;
  };
  