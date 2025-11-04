
'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GroupChats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      creatorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      type: {
        type: Sequelize.ENUM('direct', 'group'),
        allowNull: false,
        defaultValue: 'direct',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GroupChats');
  }
};