import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRole } from '../types/types';

const prisma = new PrismaClient();

interface RequestBody {
  username: string;
  password: string;
}

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

interface JwtPayload {
  id: number;
  username: string;
  role: UserRole;
}

const generateTokens = (user: JwtPayload) => {
  return {
    accessToken: jwt.sign(user, ACCESS_SECRET, { expiresIn: '15m' }),
    refreshToken: jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' })
  };
};

export const register = async (
  req: Request<{}, {}, RequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) { 
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      res.status(409).json({ error: "Username already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "regularUser",
      },
    });

    const safeUser: JwtPayload = {
      id: user.id,
      username: user.username,
      role: user.role as UserRole
    };

    const tokens = generateTokens(safeUser);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
    
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user: safeUser });
  } catch (error) {
    console.error("Registration error:", error);  
    res.status(500).json({ error: "Registration failed", details: error });
  }
};

export const login = async (
  req: Request<{}, {}, RequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;
 if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }
      
    const user = await prisma.user.findFirst({
      where: { username: username },  
      select: {
        id: true,
        username: true,
        password: true,
        role: true
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) { // Corregido: Eliminado la condición  || ''
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      role: user.role as UserRole
    };

    const tokens = generateTokens(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
    
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user: payload }); 
  } catch (error) {
    console.error("Login error:", error); 
    res.status(500).json({ error: "Login failed", details: error });
  }
};


export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken  = req.body.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ error: 'No refresh token provided' });
      return;
    }
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { id: number };

    const user = await prisma.user.findFirst({
      where: { id: decoded.id, refreshToken },
      select: { 
        id: true, 
        username: true, 
        role: true,
        refreshToken: true 
      }
    });

    if (!user) {
      res.status(403).json({ error: 'Invalid refresh token' });
      return;
    }

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      role: user.role as UserRole
    };

    const tokens = generateTokens(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken }
    });

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
    
      maxAge: 15 * 60 * 1000,
    });

    res.json(payload);
  } catch (error) {
    console.error("Error en refreshToken:", error);
    res.status(403).json({ error: "Token refresh failed" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await prisma.user.updateMany({
        where: { refreshToken },
        data: { refreshToken: null },
      });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Logout failed", details: error });
  }
};
