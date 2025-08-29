import mongoose, { Document, Schema } from "mongoose"

export interface CompanyInterface extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  website: string
  GSTIN?: string
  about_us: string
  company_size: number
  location: string
  email: string
  contact: string
  password: string
  asset_type: "plant" | "storage" | "pipeline" | "distribution_hub"
  latitude: number
  longitude: number
  createdAt?: Date
  updatedAt?: Date
}

const CompanySchema: Schema<CompanyInterface> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    website: { type: String, required: true },
    GSTIN: { type: String, required: false },
    about_us: { type: String, required: true },
    company_size: { type: Number, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    asset_type: {
      type: String,
      enum: ["plant", "storage", "pipeline", "distribution_hub"],
      required: true,
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
)

const Company = mongoose.model<CompanyInterface>("Company", CompanySchema)
export default Company
