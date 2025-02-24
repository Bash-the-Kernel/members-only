const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

describe('Authentication', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  test('Should sign up a new user', async () => {
    const response = await request(app)
      .post('/sign-up')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        username: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
    
    expect(response.statusCode).toBe(302);
    expect(response.header.location).toBe('/login');
    
    const user = await User.findOne({ where: { username: 'john@example.com' }});
    expect(user).not.toBeNull();
    expect(user.memberStatus).toBe(false);
  });

  test('Should login with valid credentials', async () => {
    await User.create({
      firstName: 'John',
      lastName: 'Doe',
      username: 'john@example.com',
      password: '$2a$10$dummyhash' // Use bcrypt hash in real tests
    });

    const response = await request(app)
      .post('/login')
      .send({
        username: 'john@example.com',
        password: 'password123'
      });
    
    expect(response.statusCode).toBe(302);
    expect(response.header.location).toBe('/');
  });
});