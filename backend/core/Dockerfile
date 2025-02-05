# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar dependencias e instalar
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate


COPY . .

RUN npm run build


FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start"]