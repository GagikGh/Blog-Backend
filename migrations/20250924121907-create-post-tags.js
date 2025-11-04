'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Post_Tags', {
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Posts',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true
      },
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tags',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true
      }
    });

    await queryInterface.addIndex('Post_Tags', ['postId']);
    await queryInterface.addIndex('Post_Tags', ['tagId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Post_Tags');
  }
};
