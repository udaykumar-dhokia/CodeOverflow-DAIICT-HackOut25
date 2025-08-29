import mongoose, { Document, Schema } from "mongoose"

export interface DistributionHubInterface extends Document {
  _id: mongoose.Types.ObjectId
  budget: number
  capacity: number
  service_radius: number
  proximity_preference: string
  land_requirement: number
  location: Array<string>
  project_developer_id: mongoose.Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
}

const DistributionHubSchema: Schema<DistributionHubInterface> = new Schema(
  {
    budget: { type: Number, required: true },
    capacity: { type: Number, required: true },
    service_radius: { type: Number, required: true }, //  km
    proximity_preference: { type: String, required: true, trim: true }, // near pipeline, near customers
    location: { type: [String], required: false, default: [] },
    land_requirement: { type: Number, required: true }, //  sq.meters or hectares
    project_developer_id: {
      type: Schema.Types.ObjectId,
      ref: "ProjectDeveloper",
      required: true,
    },
  },
  { timestamps: true }
)

const DistributionHub = mongoose.model<DistributionHubInterface>(
  "DistributionHub",
  DistributionHubSchema
)
export default DistributionHub
