import express from "express";
import SolarController from "./solar.controller";
const router = express.Router();
router.get("/get-all", SolarController.getAll);
router.post("/create", SolarController.create);
export default router;