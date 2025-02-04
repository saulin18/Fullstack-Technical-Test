import express from 'express';
import { CategoryController } from '../controllers/categoryController';
import { CategoryService } from '../services/categoryService';
import { CategoryRepository } from '../repositories/categoryRepository';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const categoryRepository = new CategoryRepository(prisma);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

const router = express.Router();

router.get('/', categoryController.getCategories);
router.post('/', categoryController.createCategory);
router.delete('/:id', categoryController.deleteCategory);
router.put('/:id', categoryController.addToOffer);


export default router;