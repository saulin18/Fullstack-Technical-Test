FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000  

CMD ["npx", "serve", "-s", "dist", "-l", "3000"]