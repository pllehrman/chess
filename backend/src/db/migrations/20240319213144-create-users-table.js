'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false,
        validate: {
          notEmpty: {
            msg: 'First name cannot be empty'
          },
          len: {
            args: [1, 255],
            msg: 'First name must be between 1 and 255 characters'
          }
        }
      },
      lastname: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false,
        validate: {
          notEmpty: {
            msg: 'Last name cannot be empty'
          },
          len: {
            args: [1, 255],
            msg: 'Last name must be between 1 and 255 characters'
          }
        }
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      hashed_password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false
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

    // Add indexes after table creation
    await queryInterface.addIndex('Users', ['id']);
    await queryInterface.addIndex('Users', ['email']);
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
