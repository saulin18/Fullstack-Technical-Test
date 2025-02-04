import express from "express";
import { PrismaClient } from "@prisma/client";
import { OfferController } from "../controllers/offerController";
import { OfferService } from "../services/offerService";
import { OfferRepository } from "../repositories/offerRepository";

import { checkRole, verifyJWT } from "../middlewares/auth";
import { UserRole } from "../types/types";

const prisma = new PrismaClient();
const offerRepository = new OfferRepository(prisma);
const offerService = new OfferService(offerRepository);
const offerController = new OfferController(offerService);

const router = express.Router();

router.get("/", offerController.getOffers);
router.get("/:id", offerController.getOfferById);
router.get("/category/:id", offerController.getOffersByCategory);

router.post(
  "/",
  verifyJWT,
  checkRole([UserRole.Admin]),
  offerController.createOffer
);

router.put(
  "/:id",
  verifyJWT,
  checkRole([UserRole.Admin]),
  offerController.updateOffer
);

router.patch(
  "/:id",
  verifyJWT,
  checkRole([UserRole.Admin]),
  offerController.deleteOffer
);

router.delete(
  "/:id/category",
  verifyJWT,
  checkRole([UserRole.Admin]),
  offerController.removeCategoryFromOffer
);

export default router;
