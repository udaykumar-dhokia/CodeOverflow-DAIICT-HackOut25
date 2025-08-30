import express from "express";
import {
  createMarketplaceItem,
  getAllMarketplaceItems,
  getMarketplaceItemById,
  updateMarketplaceItem,
  getMarketplaceAnalytics,
} from "../../features/Marketplace/Marketplace.controllers";

const router = express.Router();

router.post("/", createMarketplaceItem);
router.get("/", getAllMarketplaceItems);
router.get("/analytics", getMarketplaceAnalytics);
router.get("/:id", getMarketplaceItemById);
router.put("/:id", updateMarketplaceItem);

export default router;
