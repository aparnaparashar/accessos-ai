import mongoose, { Schema, models, model, Types } from "mongoose";

/**
 * Project model — replaces the old Application model.
 * A developer owns zero-or-more Projects; each Project owns
 * API Keys, RequestLogs, Webhooks, and Metrics.
 */
export interface IProject {
  owner: Types.ObjectId;
  name: string;
  description: string;
  environment: "production" | "development" | "staging";
  status: "active" | "inactive" | "archived";
  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    environment: { type: String, enum: ["production", "development", "staging"], default: "development" },
    status: { type: String, enum: ["active", "inactive", "archived"], default: "active" },
  },
  { timestamps: true }
);

export default models.Project || model<IProject>("Project", ProjectSchema);
