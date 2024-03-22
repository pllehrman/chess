'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TournamentMemberships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tournamentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tournaments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // Add indexes
    await queryInterface.addIndex('TournamentMemberships', ['tournamentId']);
    await queryInterface.addIndex('TournamentMemberships', ['userId']);

    // Add unique constraint on tournamentId and userId
    await queryInterface.addConstraint('TournamentMemberships', {
      fields: ['tournamentId', 'userId'],
      type: 'unique',
      name: 'unique_tournament_membership_constraint' // Name of the constraint
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TournamentMemberships');
  }
};
