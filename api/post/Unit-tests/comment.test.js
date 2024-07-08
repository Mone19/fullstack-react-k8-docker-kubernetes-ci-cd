import { createComment, editComment, getcomments, deleteComment, getPostComments, likeComment } from '../controllers/comment.controller.js';
import Comment from '../models/comment.model.js';
import { errorHandler } from '../utils/error.js';

jest.mock('../models/comment.model.js');

describe('Comment Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

 
  it('should create a new comment', async () => {
   
    const req = {
      body: {
        content: 'Test comment',
        postId: 'postId',
        userId: 'user123',
      },
      user: {
        id: 'user123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

   
    const saveMock = jest.fn();
    Comment.mockImplementation(() => ({
      save: saveMock,
    }));

    await createComment(req, res, next);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

 
  it('should get comments for a post', async () => {
    
    const req = {
      params: {
        postId: 'postId', 
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const mockComments = [{ content: 'Test comment', postId: 'postId' }];

  
    Comment.find.mockResolvedValue(mockComments);

    await getPostComments(req, res, next);

    expect(Comment.find).toHaveBeenCalledWith({ postId: 'postId' });
    expect(Comment.find).toHaveBeenCalledTimes(1);
  });


  it('should like a comment', async () => {
    
    const req = {
      params: {
        commentId: 'commentId',
      },
      user: {
        id: 'user123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();


    const mockComment = {
      _id: 'commentId',
      likes: [],
      save: jest.fn(),
    };
    Comment.findById = jest.fn().mockResolvedValue(mockComment);

    await likeComment(req, res, next);

   
    expect(Comment.findById).toHaveBeenCalledWith('commentId');
    expect(mockComment.likes).toContain('user123');
    expect(mockComment.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockComment);
    expect(next).not.toHaveBeenCalled();
  });

  it('should edit a comment', async () => {
    const req = {
      params: {
        commentId: 'commentId',
      },
      body: {
        content: 'Updated comment content',
      },
      user: {
        id: 'user123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const mockExistingComment = {
      _id: 'commentId',
      content: 'Original comment content',
      userId: 'user123',
    };

    Comment.findById = jest.fn().mockResolvedValue(mockExistingComment);

    const mockUpdatedComment = {
      ...mockExistingComment,
      content: req.body.content,
    };
    Comment.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedComment);

    await editComment(req, res, next);

    expect(Comment.findById).toHaveBeenCalledWith('commentId');
    expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(
      'commentId',
      { content: req.body.content },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUpdatedComment);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 404 error if comment is not found', async () => {
    const req = {
      params: {
        commentId: 'nonExistingCommentId',
      },
      user: {
        id: 'user123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    Comment.findById = jest.fn().mockResolvedValue(null);

    await editComment(req, res, next);

    expect(Comment.findById).toHaveBeenCalledWith('nonExistingCommentId');
    expect(next).toHaveBeenCalledWith(errorHandler(404, 'Kommentar wurde nicht gefunden'));
    expect(Comment.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 403 error if user is not authorized to edit the comment', async () => {
    const req = {
      params: {
        commentId: 'commentId',
      },
      body: {
        content: 'Updated comment content',
      },
      user: {
        id: 'unauthorizedUser',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const mockExistingComment = {
      _id: 'commentId',
      content: 'Original comment content',
      userId: 'user123',
    };

    Comment.findById = jest.fn().mockResolvedValue(mockExistingComment);

    await editComment(req, res, next);

    expect(Comment.findById).toHaveBeenCalledWith('commentId');
    expect(next).toHaveBeenCalledWith(errorHandler(403, 'Du bist nicht berechtigt, diesen Kommentar zu bearbeiten'));
    expect(Comment.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should delete a comment', async () => {
    const req = {
      params: {
        commentId: 'commentId',
      },
      user: {
        id: 'user123',
        isAdmin: false,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const mockExistingComment = {
      _id: 'commentId',
      userId: 'user123',
    };

    Comment.findById = jest.fn().mockResolvedValue(mockExistingComment);
    Comment.findByIdAndDelete = jest.fn().mockResolvedValue(mockExistingComment);

    await deleteComment(req, res, next);

   
    expect(Comment.findById).toHaveBeenCalledWith('commentId');
    expect(Comment.findByIdAndDelete).toHaveBeenCalledWith('commentId');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('Kommentar wurde gelöscht');
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 404 error if comment is not found', async () => {
    const req = {
      params: {
        commentId: 'nonExistingCommentId',
      },
      user: {
        id: 'user123',
        isAdmin: false,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

   
    Comment.findById = jest.fn().mockResolvedValue(null);

    await deleteComment(req, res, next);

   
    expect(Comment.findById).toHaveBeenCalledWith('nonExistingCommentId');
    expect(next).toHaveBeenCalledWith(errorHandler(404, 'Kommentar wurde nicht gefunden'));
    expect(Comment.findByIdAndDelete).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 403 error if user is not authorized to delete the comment', async () => {
    const req = {
      params: {
        commentId: 'commentId',
      },
      user: {
        id: 'unauthorizedUser',
        isAdmin: false,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const mockExistingComment = {
      _id: 'commentId',
      userId: 'user123',
    };

    
    Comment.findById = jest.fn().mockResolvedValue(mockExistingComment);

    await deleteComment(req, res, next);

   
    expect(Comment.findById).toHaveBeenCalledWith('commentId');
    expect(next).toHaveBeenCalledWith(errorHandler(403, 'Du bist nicht berechtigt, diesen Kommentar zu löschen'));
    expect(Comment.findByIdAndDelete).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should get comments successfully', async () => {
    const req = {
      user: {
        isAdmin: true,
      },
      query: {
        startIndex: '0',
        limit: '10',
        sort: 'asc',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const mockComments = [
      { _id: 'commentId1', content: 'Comment 1', postId: 'postId1', createdAt: new Date() },
      { _id: 'commentId2', content: 'Comment 2', postId: 'postId2', createdAt: new Date() },
    ];

    const mockTotalComments = 2;
    const mockLastMonthComments = 1;

    
    Comment.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockComments),
        }),
      }),
    });


    Comment.countDocuments = jest.fn().mockResolvedValueOnce(mockTotalComments).mockResolvedValueOnce(mockLastMonthComments);

    await getcomments(req, res, next);

    expect(Comment.find).toHaveBeenCalledWith({});
    expect(Comment.find().sort).toHaveBeenCalledWith({ createdAt: -1 }); 
    expect(Comment.find().sort().skip).toHaveBeenCalledWith(0);
    expect(Comment.find().sort().skip().limit).toHaveBeenCalledWith(10);

  });

  it('should return 403 error if user is not admin', async () => {
    const req = {
      user: {
        isAdmin: false,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getcomments(req, res, next);

    expect(next).toHaveBeenCalledWith(errorHandler(403, 'Du bist nicht berechtigt, Kommentare zu bekommen'));
    expect(Comment.find).not.toHaveBeenCalled();
    expect(Comment.countDocuments).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

});
