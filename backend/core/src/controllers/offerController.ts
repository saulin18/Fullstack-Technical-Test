import { Response, RequestHandler } from "express";
import { OfferService } from "../services/offerService";
import { ParamsDictionary } from "express-serve-static-core";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class OfferController {
  private offerService: OfferService;

  constructor(offerService: OfferService) {
    this.offerService = offerService;
  }

  private sendResponse<T>(res: Response, status: number, data: T): void {
    res.status(status).json(data);
  }

  private handleError(res: Response, status: number, message: string): void {
    this.sendResponse(res, status, { 
      message: message,
      success: false 
    });
  }

  getOffers: RequestHandler = async (req, res, next) => {
    try {
      const offers = await this.offerService.getAll();
      this.sendResponse(res, 200, offers);
    } catch (error) {
      this.handleError(res, 500, "Error al obtener ofertas");
    }
  };

  getOfferById: RequestHandler = async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        this.handleError(res, 400, "ID inválido");
        return;
      }

      const offer = await this.offerService.getById(id);
      offer
        ? this.sendResponse(res, 200, offer)
        : this.handleError(res, 404, "Oferta no encontrada");
    } catch (error) {
      this.handleError(res, 500, "Error interno del servidor");
    }
  };

  createOffer: RequestHandler = async (req, res, next) => {
    try {
      const existingOffer = await prisma.offer.findFirst({ 
        where: { title: req.body.title } 
      });
      
      if (existingOffer) {
        this.handleError(res, 409, "La oferta ya existe");
        return;
      }

      const newOffer = await this.offerService.create(req.body);
      this.sendResponse(res, 201, newOffer);
    } catch (error) {
      this.handleError(res, 400, "Error al crear oferta: " + (error instanceof Error ? error.message : ""));
    }
  };

  updateOffer: RequestHandler = async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        this.handleError(res, 400, "ID inválido");
        return;
      }

      const updatedOffer = await this.offerService.update(id, req.body);
      this.sendResponse(res, 200, updatedOffer);
    } catch (error) {
      this.handleError(res, 400, "Error al actualizar: " + (error instanceof Error ? error.message : ""));
    }
  };

  deleteOffer: RequestHandler = async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        this.handleError(res, 400, "ID inválido");
        return;
      }

      await this.offerService.delete(id);
      res.status(204).send();
    } catch (error) {
      this.handleError(res, 500, "Error al eliminar: " + (error instanceof Error ? error.message : ""));
    }
  };

  removeCategoryFromOffer: RequestHandler = async (req, res) => {
    try {
      const offerId = parseInt(req.params.id);
      if (isNaN(offerId)) {
        this.handleError(res, 400, "ID de oferta inválido");
        return;
      }

      const updatedOffer = await this.offerService.removeCategoryFromOffer(offerId);
      this.sendResponse(res, 200, updatedOffer);
    } catch (error) {
      this.handleError(res, 500, "Error al remover categoría: " + (error instanceof Error ? error.message : ""));
    }
  };
}