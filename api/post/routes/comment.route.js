import { verifyToken } from "../utils/verifyUser.js";
import express from "express";
import { createComment, getPostComments, likeComment , editComment, deleteComment, getcomments } from "../controllers/comment.controller.js";


const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get('/getPostComments/:postId', getPostComments);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/edit-comment/:commentId', verifyToken, editComment);
router.delete('/delete-comment/:commentId', verifyToken, deleteComment);
router.get('/getcomments', verifyToken, getcomments);

export default router;