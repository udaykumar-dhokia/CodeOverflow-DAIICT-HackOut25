import mongoose, { Document, Schema } from "mongoose"

export interface ProjectDeveloperInterface extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  password: string
  asset_type: "plant" | "storage" | "pipeline" | "distribution_hub" | ""
  createdAt?: Date
  updatedAt?: Date
}

const ProjectDeveloperSchema: Schema<ProjectDeveloperInterface> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    asset_type: {
      type: String,
      enum: ["plant", "storage", "pipeline", "distribution_hub", ""],
      required: false,
      default: ""
    },
  },
  { timestamps: true }
)

const ProjectDeveloper = mongoose.model<ProjectDeveloperInterface>(
  "ProjectDeveloper",
  ProjectDeveloperSchema
)

export default ProjectDeveloper
