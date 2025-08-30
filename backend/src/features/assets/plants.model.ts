import mongoose, { Schema, Document } from "mongoose";

export interface IPlant extends Document {
  project_name: string;
  budget: number;
  capacity: number;
  preferred_source: string;
  logistic_preference: string;
  location: Array<string>;
  report: string;
  project_developer_id: mongoose.Types.ObjectId;
}

const PlantSchema: Schema<IPlant> = new Schema(
  {
    project_name: {
      type: String,
      trim: true,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    preferred_source: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: [String],
      required: false,
      default: [],
    },
    report: {
      type: String,
      required: false,
      default: '',
    },
    logistic_preference: {
      type: String,
      required: true,
      enum: ["port", "demand", "pipeline", "plant"], 
    },
    project_developer_id: {
      type: Schema.Types.ObjectId,
      ref: "ProjectDeveloper",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPlant>("Plant", PlantSchema);
