# Documentación Técnica del Proyecto Fullstack

## Visión General

Proyecto fullstack que incluye:

- **Backend**: API REST con Express + TypeScript + Prisma ORM
- **Frontend**: Aplicación React + TypeScript con Vite
- **Base de datos**: PostgreSQL en Docker
- **Sistema de autenticación**: JWT
- **Gestión de ofertas/comercios**

## Arquitectura

### 1. Estructura del Proyecto

. ├── backend/ │ └── core/ # Backend principal │ ├── src/ │ │ ├── scripts/ # Scripts de base de datos │ │ └── index.ts# Punto de entrada │ ├── prisma/ # Esquemas de Prisma │ └── package.json├── frontend/ # Aplicación React │ ├── public/ │ ├── src/ │ │ ├── components/ # Componentes React │ │ ├── hooks/ # Custom hooks │ │ └── stores/ # Zustand stores │ └── package.json├── docker-compose.yml# Configuración Docker └── run.sh# Script de inicialización

### 2. Configuración del Backend

#### Tecnologías Clave

- **Express**: Framework web
- **Prisma**: ORM para PostgreSQL
- **JWT**: Autenticación con tokens
- **Zod**: Validación de datos
- **Cors**: Manejo de CORS

#### Variables de Entorno (.env)

DATABASE_URL="postgresql://postgres:mysecretpassword@postgres:5432/mydb?schema=public" BACKEND_PORT=3000 ACCESS_TOKEN_SECRET=[clave-secreta-256bits] REFRESH_TOKEN_SECRET=[clave-secreta-256bits] FRONTEND_ORIGINS=<http://localhost:5173>

#### Comandos Clave

npm run dev # Inicia servidor en desarrollo npx prisma generate # Genera cliente Prisma npx prisma migrate dev --name init # Ejecuta migraciones npm run mock # Pobla DB con datos de prueba

### 3. Configuración del Frontend

#### Tecnologías Clave

- **React 18**: Biblioteca principal
- **React Router v6**: Navegación
- **Zustand**: Gestión de estado
- **TanStack Query**: Manejo de API
- **Tailwind CSS**: Estilos

#### Variables de Entorno (.env)

VITE_BACKEND_URL=<http://localhost:3000>

3. Docker Compose
Servicios
PostgreSQL:

Versión: 15-alpine

Puerto: 5432

Volumen persistente

Backend:

Puerto: 3000

Depende de PostgreSQL

Auto-rebuild con cambios

Frontend:

Puerto: 5173 → 3000

Build con Vite

Servido con serve

Ejecución
docker-compose up --build
4. Script de Inicialización (run.sh)
Funcionalidades
Verifica instalación de Docker

Inicia contenedor PostgreSQL

Configura entorno del backend:

Crea .env

Instala dependencias

Ejecuta migraciones

Pobla datos iniciales

Configura frontend:

Crea .env

Instala dependencias

Inicia servidor

Ejecución
chmod +x run.sh
./run.sh
5. Guía de Instalación
Requisitos
Node.js18+

Docker 20+

npm 9+

Pasos Manuales (sin Docker)
Base de datos
docker run --name postgres_container -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d o usar DATABASE_URL=postgresql://saul:M4KH51h2rBzmIo4LJwKM2qwChVAbxDE0@dpg-cuic9aaj1k6c73asejmg-a.oregon-postgres.render.com/sauldb en el .env de backend/core

postgres:15-alpine
Backend
cd backend/core
npm install
npx prisma migrate dev
npm run dev
Frontend
cd frontend
npm install
npm run dev
