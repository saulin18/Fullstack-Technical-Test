

export enum UserRole {
  Admin = 'admin',
  RegularUser = 'regularUser',
  VIP = 'VIP',
}

export interface Category {
  id: number;
  name: string;
  offers?: Offer[];
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  refreshToken?: string | null;
}

export interface Offer {
  id: number;
  title: string;
  shortDesc: string;
  description: string;
  image: string;
  categoryId?: number | null;
  category?: Category;
  placeName: string;
  location: string;
  price: number;
  discount?: number | null;
  deleted: boolean;
  userId: number;
  user?: User;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: UserRole;
      };
    }
  }
}

export type CreateOfferInput = Omit<Offer, "id" | "deleted" | "category" | "user">;
export type UpdateOfferInput = Partial<CreateOfferInput>;