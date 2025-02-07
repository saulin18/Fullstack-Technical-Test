import { RequestHandler } from "express";
import { CategoryService } from "../services/categoryService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  getCategories: RequestHandler = async (req, res): Promise<void> => {
    try {
      const categories = await this.categoryService.getAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ 
        message: "Error fetching categories",
        success: false
      });
    }
  };

  createCategory: RequestHandler = async (req, res): Promise<void> => {
    try {
      const existingCategory = await prisma.category.findFirst({ 
        where: { name: req.body.name } 
      });
      
      if (existingCategory) {
        res.status(409).json({ 
          message: "Category already exists",
          success: false
        });
        return;
      }

      const newCategory = await this.categoryService.create(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(400).json({ 
        message: "Error creating category",
        success: false
      });
    }
  };

  deleteCategory: RequestHandler = async (req, res): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ 
          message: "Invalid ID",
          success: false
        });
        return;
      }

      await this.categoryService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to delete category",
        success: false
      });
    }
  };

  addToOffer: RequestHandler = async (req, res): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ 
          message: "Invalid ID",
          success: false
        });
        return;
      }

      await this.categoryService.addToOffer(id, req.body.offerId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ 
        message: "Error adding to offer",
        success: false
      });
    }
  };
}