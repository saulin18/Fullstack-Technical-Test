import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import categoryRouter from "./routers/categoryRouter";
import offerRouter from "./routers/offerRouter";
import authRouter from "./routers/authRouter";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = 3000;

const allowedOrigins = process.env.FRONTEND_ORIGINS
  ? process.env.FRONTEND_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"]; // Valor por defecto para desarrollo

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/offers", offerRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
