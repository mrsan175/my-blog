import express from 'express';
import { 
    getCategories,
    // createCategory,
    // updateCategory,
    // deleteCategory,
    // getCategoryById
 } from '../controllers/CategoryController.js';

const router = express.Router();

router.get('/api/categories', getCategories)

export default router;