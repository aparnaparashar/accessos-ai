import mongoose, { Schema, models, model, Types } from "mongoose";
import { PlanName } from "@/lib/plans";

/**
 * Developer Platform — Application model (Section 10).
 * One row per registered application/project a developer has created.
 * Owns zero-or-more ApiKey rows.
 */
export interface IApplication {
  owner: Types.ObjectId;
  name: string;
  plan: PlanName;
  allowed_apis: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    plan: { type: String, enum: ["free", "starter", "pro"], default: "free" },
    allowed_apis: { type: [String], default: ["ocr", "accessibility.assist"] },
  },
  { timestamps: true }
);

export default models.Application || model<IApplication>("Application", ApplicationSchema);
