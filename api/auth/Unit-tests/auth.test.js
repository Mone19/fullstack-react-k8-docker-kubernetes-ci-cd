import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app, server } from '../index.js'
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
jest.setTimeout(30000);

let mongoServer;

jest.mock('firebase-admin', () => {
  return {
    apps: {
      length: 0
    },
    initializeApp: jest.fn(),
    credential: {
      applicationDefault: jest.fn(() => ({})),
    },
  };
});
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked_token'),
  verify: jest.fn(() => ({ userId: 'mocked_user_id' })),
}));

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.disconnect();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});
// jest.mock('jsonwebtoken', () => ({
//   sign: jest.fn(() => 'mocked_token'),
//   verify: jest.fn(() => ({ userId: 'mocked_user_id' })),
// }));

describe('Auth API', () => {
  describe('POST /signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(201);

      const user = await User.findOne({ email: 'testuser@example.com' });
      expect(user).toBeTruthy();
      expect(user.username).toBe('testuser');
    });

    it('should not create a user with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testuser',
          password: ''
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Bitte alle Felder ausfüllen.');
    });
  });

  describe('POST /signin', () => {
    it('should sign in an existing user', async () => {
      const password = 'password123';
      const hashedPassword = bcryptjs.hashSync(password, 10);
      const user = new User({
        username: 'testuser',
        email: 'testuser@example.com',
        password: hashedPassword,
      });
      await user.save();

      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('testuser@example.com');
      expect(res.body.token).toBe('mocked_token');
    });

    it('should not sign in with invalid password', async () => {
      const password = 'password123';
      const hashedPassword = bcryptjs.hashSync(password, 10);
      const user = new User({
        username: 'testuser',
        email: 'testuser@example.com',
        password: hashedPassword,
      });
      await user.save();

      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Ungültiges Passwort');
    });

    it('should not sign in non-existing user', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'nonuser@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Benutzer wurde nicht gefunden.');
    });
  });

  describe('POST /google', () => {
    it('should sign in or sign up a user with Google', async () => {
      const res = await request(app)
        .post('/api/auth/google')
        .send({
          email: 'googleuser@gmail.com',
          name: 'Google User',
          googlePhotoUrl: 'http://example.com/photo.jpg',
        });

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('googleuser@gmail.com');
      expect(res.body.token).toBe('mocked_token');

      const user = await User.findOne({ email: 'googleuser@gmail.com' });
      expect(user).toBeTruthy();
      expect(user.profilePicture).toBe('http://example.com/photo.jpg');
    });
  });
});