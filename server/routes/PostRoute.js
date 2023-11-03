import express from 'express';
import { 
    getPosts,
    createPost,
    updatePost,
    deletePost,
    getPostBySlug,
    getPostById,
    getPostByCat
 } from '../controllers/PostController.js';
import { verifyToken } from "../middlewares/VerifyToken.js";

const router = express.Router();

router.get('/api/posts', getPosts)
.get('/api/postslug/:slug', getPostBySlug)
.get('/api/post', getPostByCat)
.get('/api/postid/:id', getPostById)
.post('/api/posts', verifyToken ,createPost)
.patch('/api/post/:id', verifyToken, updatePost)
.delete('/api/post/:id', verifyToken, deletePost)


export default router;