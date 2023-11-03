import express from 'express';
import { 
    getComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
 } from '../controllers/CommentController.js';

const router = express.Router();

router.get('/api/comments', getComments)
.get('/api/comment/:id', getCommentById)
.post('/api/comments', createComment)
.patch('/api/comment/:id', updateComment)
.delete('/api/comment/:id', deleteComment)

export default router;