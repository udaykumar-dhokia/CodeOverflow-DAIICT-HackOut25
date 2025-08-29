import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import connectDB from "./config/db.config";
import projectdeveloperauth from './features/auth/auth.routes'
import windroute from './features/wind/wind.route'
import solarroute from './features/solar/solar.route'
const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: ["*"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', projectdeveloperauth);
app.use('/api/wind', windroute);
app.use('/api/solar', solarroute);
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Server is up and running..." });
});
server.listen(3000, () => {
  connectDB()
  console.log("Server is up and running...");
});
