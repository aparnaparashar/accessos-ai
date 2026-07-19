import mongoose, { Schema, models, model, Types } from "mongoose";

/**
 * UsageLog (Section 10/11) — one row per API call, written for both the
 * API-key-authenticated developer product routes and the JWT-authenticated
 * /v1/accessibility/assist route. Backs /v1/analytics and /v1/billing/usage.
 */
export interface IUsageLog {
  application?: Types.ObjectId | null; // null for JWT-authenticated end-user calls
  user?: Types.ObjectId | null;
  api: string;
  status_code: number;
  latency_ms: number;
  createdAt?: Date;
}

const UsageLogSchema = new Schema<IUsageLog>(
  {
    application: { type: Schema.Types.ObjectId, ref: "Application", default: null, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    api: { type: String, required: true, index: true },
    status_code: { type: Number, required: true },
    latency_ms: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

UsageLogSchema.index({ application: 1, createdAt: -1 });

export default models.UsageLog || model<IUsageLog>("UsageLog", UsageLogSchema);
