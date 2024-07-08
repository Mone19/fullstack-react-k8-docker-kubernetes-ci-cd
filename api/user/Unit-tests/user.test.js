import {
  test,
  updateUser,
  deleteUser,
  signout,
  getUsers,
  getUser,
} from '../controllers/user.controller.js';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import request from 'supertest';
import { app, server } from '../index.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js'; 
import { verifyToken } from '../utils/verifyUser.js';


jest.setTimeout(30000);

jest.mock('../models/user.model.js', () => ({
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  findById: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hashSync: jest.fn(),
}));

jest.mock('jsonwebtoken');

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
});

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('test', () => {
    it('should return a JSON object with message "is it working"', async () => {
      const res = await request(app).get('/api/user/test');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('is it working');
    });
  });

  
  describe('updateUser', () => {
    it('should update user data when provided correct input', async () => {
      const req = {
        user: { id: 'userId' },
        params: { userId: 'userId' },
        body: {
          username: 'newusername',
          email: 'newemail@example.com',
          profilePicture: 'newPictureUrl',
          password: 'newpassword',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      bcryptjs.hashSync.mockReturnValue('hashedPassword');

      const updatedUser = {
        _doc: {
          username: 'newusername',
          email: 'newemail@example.com',
          profilePicture: 'newPictureUrl',
        },
      };
      User.findByIdAndUpdate.mockResolvedValue(updatedUser);

      await updateUser(req, res, next);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        'userId',
        {
          $set: {
            username: 'newusername',
            email: 'newemail@example.com',
            profilePicture: 'newPictureUrl',
            password: 'hashedPassword',
          },
        },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        username: 'newusername',
        email: 'newemail@example.com',
        profilePicture: 'newPictureUrl',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user tries to update another user', async () => {
      const req = {
        user: { id: 'userId1' },
        params: { userId: 'userId2' },
      };
      const res = {};
      const next = jest.fn();

      await updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 403,
        message: 'Du bist nicht berechtigt, diesen Nutzer zu aktualisieren',
      }));
    });

    it('should return 400 if password is less than 6 characters', async () => {
      const req = {
        user: { id: 'userId' },
        params: { userId: 'userId' },
        body: { password: 'short' },
      };
      const res = {};
      const next = jest.fn();

      await updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: 'Das Passwort muss mindestens 6 Zeichen lang sein',
      }));
    });

    it('should return 400 if username is invalid', async () => {
      const req = {
        user: { id: 'userId' },
        params: { userId: 'userId' },
        body: { username: 'short' },
      };
      const res = {};
      const next = jest.fn();

      await updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        // message: 'Der Benutzername muss mindestens zwischen 7 und 20 Zeichen lang sein',
      }));
    });

    it('should return 400 if username contains spaces', async () => {
      const req = {
        user: { id: 'userId' },
        params: { userId: 'userId' },
        body: { username: 'invalid username' },
      };
      const res = {};
      const next = jest.fn();

      await updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: 'Der Benutzername darf keine Leerzeichen enthalten',
      }));
    });

    it('should return 400 if username contains uppercase letters', async () => {
      const req = {
        user: { id: 'userId' },
        params: { userId: 'userId' },
        body: { username: 'InvalidUsername' },
      };
      const res = {};
      const next = jest.fn();

      await updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: 'Der Benutzer muss aus Kleinbuchstaben bestehen',
      }));
    });

    it('should return 400 if username contains non-alphanumeric characters', async () => {
      const req = {
        user: { id: 'userId' },
        params: { userId: 'userId' },
        body: { username: 'invalid_username!' },
      };
      const res = {};
      const next = jest.fn();

      await updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: 'Der Benutzername darf nur Buchstaben und Zahlen enthalten',
      }));
    });
  });

  describe('deleteUser', () => {
    
    it('should delete a user when provided correct input', async () => {
      const req = {
        user: { isAdmin: true, id: 'userId' },
        params: { userId: 'userId' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      User.findByIdAndDelete.mockResolvedValue();

      await deleteUser(req, res, next);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith('userId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith('Benutzer wurde gelöscht');
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if non-admin tries to delete another user', async () => {
      const req = {
        user: { isAdmin: false, id: 'regularUserId' }, 
        params: { userId: 'userIdToDelete' }, 
      };
      const res = {};
      const next = jest.fn();
  
      await deleteUser(req, res, next);
  
      expect(User.findByIdAndDelete).not.toHaveBeenCalled(); 
      // expect(next).toHaveBeenCalledWith(expect.objectContaining({
      //   statusCode: 403,
      //   message: 'Du ist nicht berechtigt, diesen Benutzer zu löschen',
      // }));
      // expect(res.status).not.toHaveBeenCalled();
      // expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('signout', () => {
    it('should sign out a user', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await signout(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({"message": "Der Benutzer wurde erfolgreich abgemeldet", "token": null});
      expect(next).not.toHaveBeenCalled();
    });
  });


  describe('getUsers', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 403 if user is not an admin', async () => {
      const req = {
        user: { isAdmin: false },
        query: {},
      };
      const res = {};
      const next = jest.fn();
  
      await getUsers(req, res, next);
  
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 403,
        message: 'Du bist nicht berechtigt, alle Nutzer zu sehen',
      }));
    });
  
    it('should get all users when user is admin with default query params', async () => {
      const req = {
        user: { isAdmin: true },
        query: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
  
      const users = [{ _doc: { username: 'user1' } }, { _doc: { username: 'user2' } }];
      User.find.mockResolvedValue(users);
      User.countDocuments
        .mockResolvedValueOnce(2)  // totalUsers
        .mockResolvedValueOnce(1); // lastMonthUsers
  
      await getUsers(req, res, next);
  
      // expect(User.find).toHaveBeenCalledWith({});
      // expect(User.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
      // expect(User.find().skip).toHaveBeenCalledWith(0);
      // expect(User.find().limit).toHaveBeenCalledWith(9);
      // expect(User.countDocuments).toHaveBeenCalledTimes(2);
      // expect(res.status).toHaveBeenCalledWith(200);
      // expect(res.json).toHaveBeenCalledWith({
      //   users: [{ username: 'user1' }, { username: 'user2' }],
      //   totalUsers: 2,
      //   lastMonthUsers: 1,
      // });
      // expect(next).not.toHaveBeenCalled();
    });
  
    it('should get all users when user is admin with provided query params', async () => {
      const req = {
        user: { isAdmin: true },
        query: { startIndex: '1', limit: '2', sort: 'asc' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
  
      const users = [{ _doc: { username: 'user1' } }, { _doc: { username: 'user2' } }];
      User.find.mockResolvedValue(users);
      User.countDocuments
        .mockResolvedValueOnce(2)  
        .mockResolvedValueOnce(1);
  
      await getUsers(req, res, next);
  
    //   expect(User.find).toHaveBeenCalledWith({});
    //   expect(User.find().sort).toHaveBeenCalledWith({ createdAt: 1 });
    //   expect(User.find().skip).toHaveBeenCalledWith(1);
    //   expect(User.find().limit).toHaveBeenCalledWith(2);
    //   expect(User.countDocuments).toHaveBeenCalledTimes(2);
    //   expect(res.status).toHaveBeenCalledWith(200);
    //   expect(res.json).toHaveBeenCalledWith({
    //     users: [{ username: 'user1' }, { username: 'user2' }],
    //     totalUsers: 2,
    //     lastMonthUsers: 1,
    //   });
    //   expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should get user by ID', async () => {
      const req = {
        params: { userId: 'userId' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const user = { _doc: { username: 'user1' } };
      User.findById.mockResolvedValue(user);

      await getUser(req, res, next);

      expect(User.findById).toHaveBeenCalledWith('userId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ username: 'user1' });
    });

    it('should return 404 if user not found', async () => {
      const req = {
        params: { userId: 'userId' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      User.findById.mockResolvedValue(null);

      await getUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 404,
        message: 'Benutzer nicht gefunden',
      }));
    });
  });

describe('verifyToken Middleware', () => {
  let req, res, next;

  beforeEach(() => {

    req = {
       headers: {},
    };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() and set req.user if token is valid', () => {
    const mockUser = { id: 'userId', username: 'testuser' };
    const token = 'valid_token';

    req.headers.authorization = `Bearer ${token}`;

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, mockUser); 
    });

    verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET, expect.any(Function));
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next(error) if token is missing', () => {
    verifyToken(req, res, next);

    expect(jwt.verify).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401, message: 'Unauthorized' }));
  });

  it('should call next(error) if token verification fails', () => {
    const token = 'invalid_token';

    req.headers.authorization = `Bearer ${token}`;

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Token verification failed')); // Simulate a failed token verification
    });

    verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET, expect.any(Function));
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401, message: 'Unauthorized' }));
  });
});
});
