import mongoose, { Schema, Document } from "mongoose";

export interface MarketplaceItemInterface extends Document {
  title: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  seller_email: string;
  seller_contact: string;
  seller_name: string;
  images: string[];
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const MarketplaceSchema: Schema<MarketplaceItemInterface> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    seller_email: { type: String, required: true },
    seller_contact: { type: String, required: true },
    seller_name: { type: String, required: true },
    images: [{ type: String }],
    tags: [{ type: String }]
  },
  { timestamps: true }
);

const MarketplaceItem = mongoose.model<MarketplaceItemInterface>(
  "MarketplaceItem",
  MarketplaceSchema
);

export default MarketplaceItem;