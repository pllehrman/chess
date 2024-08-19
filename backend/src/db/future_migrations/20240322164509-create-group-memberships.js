'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('GroupMemberships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
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
    })

    // Add indexes
    await queryInterface.addIndex('GroupMemberships', ['groupId'])
    await queryInterface.addIndex('GroupMemberships', ['userId'])

    // Add unique constraint on tournamentId and userId
    await queryInterface.addConstraint('GroupMemberships', {
      fields: ['groupId', 'userId'],
      type: 'unique',
      name: 'unique_group_membership_constraint' // Name of the constraint
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('GroupMemberships')
  }
}
