'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Games', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      winner: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: {
          isInt: {
            msg: 'Winner must be an integer'
          }
        }
      },
      position: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
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
          isArray: {
            msg: 'Position must be an array of integers'
          },
          isValidPosition(value) {
            if (value.length !== 64) {
              throw new Error('Position array must contain 64 elements');
            }
            // Add more validation if needed
          }
        }
      },
      turn: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'Turn must be an integer'
          }
        }
      },
      playerWhite: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'PlayerWhite must be an integer'
          }
        }
      },
      playerBlack: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'PlayerBlack must be an integer'
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    queryInterface.addIndex('Games', ['winner']);
    queryInterface.addIndex('Games', ['playerWhite']);
    queryInterface.addIndex('Games', ['playerBlack']);

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Games');
  }
};
