'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "notificationMessages", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "enabled",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("messages", "isRead");
  },
};
