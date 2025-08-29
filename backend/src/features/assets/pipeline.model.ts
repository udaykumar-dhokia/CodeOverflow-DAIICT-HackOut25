import mongoose, { Document, Schema } from "mongoose"

export interface PipelineInterface extends Document {
  _id: mongoose.Types.ObjectId
  budget: number
  capacity: number
  length_estimate: number
  route_preference: string
  project_developer_id: mongoose.Types.ObjectId
  location: Array<string>
  createdAt?: Date
  updatedAt?: Date
}

const PipelineSchema: Schema<PipelineInterface> = new Schema(
  {
    budget: { type: Number, required: true },
    capacity: { type: Number, required: true },
    length_estimate: { type: Number, required: true },
    route_preference: { type: String, required: true, trim: true },
    location: { type: [String], required: false, default: [] },
    project_developer_id: {
      type: Schema.Types.ObjectId,
      ref: "ProjectDeveloper",
      required: true,
    },
  },
  { timestamps: true }
)

const Pipeline = mongoose.model<PipelineInterface>("Pipeline", PipelineSchema)
export default Pipeline
