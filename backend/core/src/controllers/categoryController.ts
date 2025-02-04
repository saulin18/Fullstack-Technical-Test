import { RequestHandler } from 'express';
import { CategoryService } from '../services/categoryService';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  getCategories: RequestHandler = async (req, res): Promise<void> => {
    try {
      const categories = await this.categoryService.getAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las categorías' });
    }
  };


  createCategory: RequestHandler = async (req, res): Promise<void> => {
    try {
      const newCategory = await this.categoryService.create(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear la categoría' });
    }
  };

  deleteCategory: RequestHandler = async (req, res): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      
      await this.categoryService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar' });
    }
  };

  addToOffer: RequestHandler = async (req, res): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      
      await this.categoryService.addToOffer(id, req.body.offerId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar a oferta' });
    }
  };

  removeCategoryFromOffer: RequestHandler = async (req, res): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      
      await this.categoryService.removeCategoryFromOffer(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar' });
    }
  };

}