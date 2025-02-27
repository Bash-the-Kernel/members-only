const { User } = require('../models');

module.exports = {
  createTestUser: async (overrides = {}) => {
    return User.create({
      firstName: 'Test',
      lastName: 'User',
      username: 'test@example.com',
      password: 'password123',
      memberStatus: false,
      admin: false,
      ...overrides
    });
  }
};