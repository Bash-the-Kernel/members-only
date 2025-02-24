const request = require('supertest');
const app = require('../app');
const { User, Message } = require('../models');

describe('Messages', () => {
  let authAgent;

  beforeEach(async () => {
    await User.destroy({ where: {} });
    await Message.destroy({ where: {} });
    
    // Create test user
    await User.create({
      firstName: 'Test',
      lastName: 'User',
      username: 'test@example.com',
      password: 'hashedpassword',
      memberStatus: true
    });

    // Create authenticated agent
    authAgent = request.agent(app);
    await authAgent
      .post('/login')
      .send({ username: 'test@example.com', password: 'password123' });
  });

  test('Should create a new message', async () => {
    const response = await authAgent
      .post('/create-message')
      .send({
        title: 'Test Message',
        text: 'This is a test message'
      });
    
    expect(response.statusCode).toBe(302);
    
    const message = await Message.findOne({ where: { title: 'Test Message' }});
    expect(message).not.toBeNull();
  });
});