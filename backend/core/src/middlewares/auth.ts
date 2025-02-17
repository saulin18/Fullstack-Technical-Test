import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

declare module "express" {
  interface Request {
    user?: {
      id: number;
      username: string;
      role: string;
    };
  }
}

const prisma = new PrismaClient();

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];


  if (!token) {
    res.status(401).json({ error: "Token no proporcionado" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: number;
      username: string;
      role: string;

    };

     const user = await prisma.user.findFirst({
        where: { id: decoded.id, username: decoded.username },
        select: { id: true, username: true, role: true },
      });
    
    
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    console.log("Headers recibidos:", req.headers);
    console.log("Cookies recibidas:", req.cookies);
    console.log("Token detectado:", token);
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expirado" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Token inválido" });
    } else {
      console.error("Error en verifyJWT:", error);
      console.log(error)
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
