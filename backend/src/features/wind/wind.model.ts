import mongoose, { Document, Schema } from "mongoose"

export interface WindInterface extends Document {
  latitude: number
  longitude: number
  speed : number  
  createdAt?: Date
  updatedAt?: Date
}

const WindSchema: Schema<WindInterface> = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    speed: { type: Number, required: true }
  },
  { timestamps: true }
)

const Wind = mongoose.model<WindInterface>("Wind", WindSchema)
export default Wind
