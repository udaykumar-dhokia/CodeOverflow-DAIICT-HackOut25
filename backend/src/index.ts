import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.config";
import projectdeveloperauth from "./features/auth/auth.routes";
import windroute from "./features/wind/wind.route";
import solarroute from "./features/solar/solar.route";
import assetsroutes from "./features/assets/assets.routes";
import MarketPlaceRoutes from "./features/Marketplace/Marketplace.routes";

const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: ["http://localhost:5173", "https://h2grid.vercel.app"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", projectdeveloperauth);
app.use("/api/wind", windroute);
app.use("/api/solar", solarroute);
app.use("/api/assets", assetsroutes);
app.use("/api/marketplace", MarketPlaceRoutes);
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Server is up and running..." });
});
server.listen(3000, () => {
  connectDB();
  console.log("Server is up and running...");
});
