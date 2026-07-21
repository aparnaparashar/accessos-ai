import mongoose, { Schema, models, model, Types } from "mongoose";

/**
 * API Key model — belongs to a Project.
 * `secret_hash` is a bcrypt hash — the plaintext secret is never stored.
 * `ip_allowlist`, if non-empty, restricts which caller IPs may use this key.
 */
export interface IApiKey {
  project: Types.ObjectId;
  name: string;
  client_id: string;
  secret_hash: string;
  environment: "production" | "development";
  ip_allowlist: string[];
  revoked: boolean;
  last_used_at?: Date | null;
  requests_today: number;
  total_requests: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    name: { type: String, default: "Default Key", trim: true },
    client_id: { type: String, required: true, unique: true, index: true },
    secret_hash: { type: String, required: true },
    environment: { type: String, enum: ["production", "development"], default: "development" },
    ip_allowlist: { type: [String], default: [] },
    revoked: { type: Boolean, default: false },
    last_used_at: { type: Date, default: null },
    requests_today: { type: Number, default: 0 },
    total_requests: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.ApiKey || model<IApiKey>("ApiKey", ApiKeySchema);
