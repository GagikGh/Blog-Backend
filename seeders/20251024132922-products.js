'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {

      await queryInterface.bulkInsert('Products', [{
        name: 'Omega',
        price: 1000,
        imageUrl: "../images/omega.webp",
        createdAt: new Date(),
     },
        {
          name: 'Boss',
          price: 2000,
          imageUrl: "../images/boss.jpg",
          createdAt: new Date(),
        },
        {
          name: 'Casio',
          price: 3000,
          imageUrl: "../images/casio.webp",
          createdAt: new Date(),
        },
        {
          name: 'Jacob & Co',
          price: 5000,
          imageUrl: "../images/jacob&co.webp",
          createdAt: new Date(),
        }
      ], {});

  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Products', null, {});

  }
};
