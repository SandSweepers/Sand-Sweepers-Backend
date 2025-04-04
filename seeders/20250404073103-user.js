'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const hashedPassword1 = bcrypt.hashSync("password123", 10);
    const hashedPassword2 = bcrypt.hashSync("password456", 10);
    const hashedPassword3 = bcrypt.hashSync("adminpassword", 10);  // For the admin user

    await queryInterface.bulkInsert('users', [
      {
        name: 'John Doe',
        username: 'john_doe',
        password: hashedPassword1,
        avatar: 'https://example.com/avatar/john_doe.jpg',
        role: 'USER',  
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jane Doe',
        username: 'jane_doe',
        password: hashedPassword2,
        avatar: 'https://example.com/avatar/jane_doe.jpg',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Admin User',
        username: 'admin_user',
        password: hashedPassword3,
        avatar: 'https://example.com/avatar/admin_user.jpg',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
   
    await queryInterface.bulkDelete('users', null, {});
  }
};
