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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/offers", offerRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
