import mongoose, { Document, Schema } from "mongoose"
import { ProjectDeveloperInterface } from "../project_developers/project_developers.model"

export interface StorageInterface extends Document {
  budget: number
  capacity: number
  technology: string
  proximity_preference: "plant" | "demand" | "port"
  project_developer_id: ProjectDeveloperInterface["_id"]
  location: Array<string>
  createdAt?: Date
  updatedAt?: Date
}

const StorageSchema: Schema<StorageInterface> = new Schema(
  {
    budget: { type: Number, required: true },
    capacity: { type: Number, required: true },
    technology: { type: String, required: false, default:"" },
    proximity_preference: {
      type: String,
      enum: ["plant", "demand", "port"],
      required: true,
    },
    location: { type: [String], required: false, default: [] },
    project_developer_id: {
      type: Schema.Types.ObjectId,
      ref: "ProjectDeveloper",
      required: true,
    },
  },
  { timestamps: true }
)

const Storage = mongoose.model<StorageInterface>("Storage", StorageSchema)
export default Storage