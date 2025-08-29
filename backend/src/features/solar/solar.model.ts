import mongoose, { Document, Schema } from "mongoose"

export interface SolarInterface extends Document {
  latitude: number
  longitude: number
  createdAt?: Date
  updatedAt?: Date
}

const SolarSchema: Schema<SolarInterface> = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
)

const Solar = mongoose.model<SolarInterface>("Solar", SolarSchema)
export default Solar
