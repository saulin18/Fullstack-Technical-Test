import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../types/types";
import { PrismaClient } from "@prisma/client";

declare module "express" {
  interface Request {
    user?: {
      id: number;
      username: string;
      role:  string;
    };
  }
}

const prisma = new PrismaClient();

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ error: "Token no proporcionado" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, role: true },
    });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
   
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expirado" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Token inválido" });
    } else {
      console.error("Error en verifyJWT:", error); 
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
};
export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res
        .status(403)
        .json({ error: `Requires roles: ${allowedRoles.join(", ")}` });
      return;
    }
    next();
  };
};
