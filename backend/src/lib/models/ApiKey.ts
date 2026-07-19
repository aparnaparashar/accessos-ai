import mongoose, { Schema, models, model, Types } from "mongoose";

/**
 * Developer Platform — ApiKey model (Section 10/12).
 * `secret_hash` is a bcrypt hash — the plaintext secret is never stored.
 * `ip_allowlist`, if non-empty, restricts which caller IPs may use this key.
 */
export interface IApiKey {
  application: Types.ObjectId;
  client_id: string;
  secret_hash: string;
  ip_allowlist: string[];
  revoked: boolean;
  last_used_at?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    application: { type: Schema.Types.ObjectId, ref: "Application", required: true, index: true },
    client_id: { type: String, required: true, unique: true, index: true },
    secret_hash: { type: String, required: true },
    ip_allowlist: { type: [String], default: [] },
    revoked: { type: Boolean, default: false },
    last_used_at: { type: Date, default: null },
  },
  { timestamps: true }
);

export default models.ApiKey || model<IApiKey>("ApiKey", ApiKeySchema);
