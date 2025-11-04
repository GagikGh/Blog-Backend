'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GroupMembers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'GroupChats',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      role: {
        type: Sequelize.ENUM('Admin', 'Chat'),
        allowNull: false,
        defaultValue: 'Chat'
      },
      joinedAt: {
        allowNull: false,
        type: Sequelize.BIGINT
      },

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GroupMembers');
  }
};