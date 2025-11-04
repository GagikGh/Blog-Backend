'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Pricing', [
      {
        title: "Starter",
        price: 0,
        status: "/",
        billing: "none",
        description: "Perfect for individuals starting out.",
        features: JSON.stringify(["1 Project", "5GB Storage", "Basic Support"]),
      },
      {
        title: "Pro",
        price: 100,
        status: "/",
        billing: "monthly",
        description: "Ideal for professionals and small teams.",
        features: JSON.stringify(["5 Projects", "50GB Storage", "Priority Support"]),
      },
      {
        title: "Enterprise",
        price: 200,
        status: "/",
        billing: "yearly",
        description: "Best for large organizations.",
        features: JSON.stringify(["Unlimited Projects", "500GB Storage", "Dedicated Support"]),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Pricing', null, {});
  }
};
