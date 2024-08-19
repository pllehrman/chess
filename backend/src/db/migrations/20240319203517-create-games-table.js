'use strict'

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
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: 'Game type must be an integer value'
          }
        }
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
      fen: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' // Starting position in FEN
      },
      playerWhite: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: 'PlayerWhite must be an integer.'
          }
        }
      },
      playerWhiteTimeRemaining: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: 'PlayerWhite time must be an integer.'
          }
        }
      },
      playerBlack: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: 'PlayerBlack must be an integer.'
          }
        }
      },
      playerBlackTimeRemaining: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: 'PlayerBlack time must be an integer.'
          }
        }
      },
      timeIncrement: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'TimeIncrement must be an integer.'
          }
        }
      },
      numPlayers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: 'num_players must be an integer.'
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
    })

    queryInterface.addIndex('Games', ['winner'])
    queryInterface.addIndex('Games', ['playerWhite'])
    queryInterface.addIndex('Games', ['playerBlack'])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Games')
  }
}
