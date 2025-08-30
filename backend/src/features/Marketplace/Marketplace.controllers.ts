import { Request, Response } from "express";
import { Types } from "mongoose";
import MarketplaceItem from "../../features/Marketplace/Marketplace.model"

export const createMarketplaceItem = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      price,
      quantity,
      seller_email,
      seller_contact,
      seller_name,
      images,
      tags,
    } = req.body;
    if (!title || !description || !category || !price || !seller_email || !seller_contact || !seller_name) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newItem = await MarketplaceItem.create({
      title,
      description,
      category,
      price,
      quantity: quantity || 1,
      seller_email,
      seller_contact,
      seller_name,
      images: images || [],
      tags: tags || [],
    });
    return res.status(201).json({ message: "Item created successfully", data: newItem });
  } catch (error) {
    return res.status(500).json({ message: "Error creating item", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const getAllMarketplaceItems = async (req: Request, res: Response) => {
  try {
    const items = await MarketplaceItem.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: items });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching items", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const getMarketplaceItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    const item = await MarketplaceItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ data: item });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching item", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const updateMarketplaceItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    const updatedItem = await MarketplaceItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ message: "Item updated successfully", data: updatedItem });
  } catch (error) {
    return res.status(500).json({ message: "Error updating item", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const getMarketplaceAnalytics = async (req: Request, res: Response) => {
  try {
    const totalItems = await MarketplaceItem.countDocuments();
    const totalValue = await MarketplaceItem.aggregate([{ $group: { _id: null, total: { $sum: { $multiply: ["$price", "$quantity"] } } } }]);
    const categoryBreakdown = await MarketplaceItem.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);

    return res.status(200).json({
      totalItems,
      totalValue: totalValue[0]?.total || 0,
      categoryBreakdown,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching analytics", error: error instanceof Error ? error.message : "Unknown error" });
  }
};
