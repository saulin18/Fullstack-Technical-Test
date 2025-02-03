export interface Category {
  id: number    
  name: string
}

export interface Offer {
  id: number
  title: string
  shortDescription: string
  imageUrl: string
  category: Category
  placeName: string
  location: string
  price: number
  discount?: number
  deleted: boolean
  user_id: number
}

export interface User {
    id: number
    email: string
    password: string
    isAuthenticated: boolean
    role: Roles
  }

export type Roles = "admin" | "regularUser" | "vipUser"