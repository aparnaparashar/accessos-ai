import mongoose, { Schema, models, model, Types } from "mongoose";

/**
 * RequestLog — one row per API call. Replaces the old UsageLog.
 * Stores all fields needed by the Project → Logs tab:
 * Timestamp, Endpoint, Method, Status, Latency, API Key, Project, Errors.
 */
export interface IRequestLog {
  project: Types.ObjectId;
  api_key?: Types.ObjectId | null;
  endpoint: string;
  method: string;
  status_code: number;
  latency_ms: number;
  error?: string | null;
  createdAt?: Date;
}

const RequestLogSchema = new Schema<IRequestLog>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    api_key: { type: Schema.Types.ObjectId, ref: "ApiKey", default: null, index: true },
    endpoint: { type: String, required: true, index: true },
    method: { type: String, required: true },
    status_code: { type: Number, required: true },
    latency_ms: { type: Number, required: true },
    error: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

RequestLogSchema.index({ project: 1, createdAt: -1 });
RequestLogSchema.index({ project: 1, endpoint: 1 });
RequestLogSchema.index({ project: 1, status_code: 1 });

export default models.RequestLog || model<IRequestLog>("RequestLog", RequestLogSchema);
