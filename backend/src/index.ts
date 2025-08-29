import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(500).json({ message: "Server is up and running..." });
});

server.listen(3000, () => {
  console.log("Server is up and running...");
});
