import Post from '../models/post.model.js';
import {
  create,
  getposts,
  deletepost,
  updatepost,
} from '../controllers/post.controller.js';
import { errorHandler } from '../utils/error.js';

jest.mock('../models/post.model.js');

describe('Post Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  
  describe('create', () => {
    it('should create a new post', async () => {
      const req = {
        user: { id: 'userId', isAdmin: true },
        body: { title: 'Test Post', content: 'This is a test post' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const mockSavedPost = {
        _id: 'postId',
        title: 'Test Post',
        content: 'This is a test post',
        slug: 'test-post',
        userId: 'userId',
      };
      Post.mockReturnValue({
        save: jest.fn().mockResolvedValue(mockSavedPost),
      });

      await create(req, res, next);

      expect(Post).toHaveBeenCalledTimes(1);
      expect(Post).toHaveBeenCalledWith({
        ...req.body,
        slug: 'test-post',
        userId: req.user.id,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSavedPost);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 error if user is not admin', async () => {
      const req = {
        user: { isAdmin: false },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await create(req, res, next);

      expect(next).toHaveBeenCalledWith(
        errorHandler(403, 'Du bist nicht berechtigt, einen Beitrag zu erstellen')
      );
      expect(Post).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 400 error if title or content is missing', async () => {
      const req = {
        user: { isAdmin: true },
        body: { content: 'This is a test post' }, 
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await create(req, res, next);

      expect(next).toHaveBeenCalledWith(
        errorHandler(400, 'Bitte alle Felder ausfüllen.')
      );
      expect(Post).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getposts', () => {
    it('should get posts with query parameters', async () => {
      const req = {
        query: { startIndex: '0', limit: '10', order: 'asc', userId: 'userId', category: 'technology' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const mockPosts = [
        { _id: 'postId1', title: 'Post 1', content: 'Content 1' },
        { _id: 'postId2', title: 'Post 2', content: 'Content 2' },
      ];
      const mockTotalPosts = 2;
      const mockLastMonthPosts = 1;

      Post.find.mockResolvedValue(mockPosts);
      Post.countDocuments.mockResolvedValue(mockTotalPosts);

      const now = new Date();
      Post.countDocuments.mockResolvedValueOnce(mockLastMonthPosts);

      await getposts(req, res, next);

      expect(Post.find).toHaveBeenCalledWith({
        userId: 'userId',
        category: 'technology',
      });

    });

  
  });


  describe('deletepost', () => {
    it('should delete a post', async () => {
      const req = {
        user: { id: 'userId', isAdmin: true },
        params: { postId: 'postId' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      Post.findByIdAndDelete.mockResolvedValue({ _id: 'postId' });

      await deletepost(req, res, next);

    });

    it('should return 403 error if user is not admin', async () => {
      const req = {
        user: { isAdmin: false },
        params: { postId: 'postId' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await deletepost(req, res, next);

      expect(next).toHaveBeenCalledWith(
        errorHandler(403, 'Du bist nicht berechtigt, diesen Beitrag zu löschen')
      );
      expect(Post.findByIdAndDelete).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('updatepost', () => {

    it('should return 403 error if user is not admin', async () => {
      const req = {
        user: { isAdmin: false },
        params: { postId: 'postId' },
        body: { title: 'Updated Post', content: 'Updated content', category: 'updated' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await updatepost(req, res, next);

      expect(next).toHaveBeenCalledWith(
        errorHandler(403, 'Du bist nicht berechtigt, diesen Beitrag zu bearbeiten')
      );
      expect(Post.findByIdAndUpdate).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('deletepost', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should delete a post when user is admin and postId is valid', async () => {
      const req = {
        user: { id: 'adminUserId', isAdmin: true },
        params: { postId: 'validPostId', userId: 'ownerUserId' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
  
      Post.findByIdAndDelete.mockResolvedValue({ _id: 'validPostId' });
  
      await deletepost(req, res, next);
  ;
    });
  
    it('should return 403 error if user is not admin or not the owner of the post', async () => {
      const req = {
        user: { id: 'regularUserId', isAdmin: false },
        params: { postId: 'validPostId', userId: 'ownerUserId' },
      };
      const res = {};
      const next = jest.fn();
  
      await deletepost(req, res, next);
  
      expect(next).toHaveBeenCalledWith(
        errorHandler(403, 'Du bist nicht berechtigt, diesen Beitrag zu löschen')
      );
      expect(Post.findByIdAndDelete).not.toHaveBeenCalled();
    });
  
    it('should pass the error to next middleware if deletion fails', async () => {
      const req = {
        user: { id: 'adminUserId', isAdmin: true },
        params: { postId: 'invalidPostId', userId: 'ownerUserId' },
      };
      const res = {};
      const next = jest.fn();
  
      const mockError = new Error('Du bist nicht berechtigt, diesen Beitrag zu löschen');
      Post.findByIdAndDelete.mockRejectedValue(mockError);
  
      await deletepost(req, res, next);
      
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
