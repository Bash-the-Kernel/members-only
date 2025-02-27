describe('Security', () => {
    test('Non-members should not see author info', async () => {
      // Create member user and message
      const member = await User.create({
        firstName: 'Member',
        lastName: 'User',
        username: 'member@example.com',
        password: 'password',
        memberStatus: true
      });
      
      await Message.create({
        title: 'Secret Message',
        text: 'Members only content',
        UserId: member.id
      });
  
      // Create non-member user
      const nonMember = await User.create({
        firstName: 'Non',
        lastName: 'Member',
        username: 'nonmember@example.com',
        password: 'password',
        memberStatus: false
      });
  
      const agent = request.agent(app);
      await agent
        .post('/login')
        .send({ username: 'nonmember@example.com', password: 'password' });
  
      const response = await agent.get('/');
      expect(response.text).not.toContain('Member User');
    });
  });