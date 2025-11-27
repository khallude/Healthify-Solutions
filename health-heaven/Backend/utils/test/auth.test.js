const request = require('supertest');
const app = require('../../index'); // Adjust if your server setup is different

describe('Auth API', () => {
  it('should sign up a user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
  });

  it('should log in a user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
