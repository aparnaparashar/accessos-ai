import mongoose, { Schema, models, model, Types } from "mongoose";

/**
 * AuditLog (Section 10) — one row per mutating developer-platform action
 * (application create/update, key generate/rotate/revoke). Read via
 * GET /v1/audit. Never contains raw secrets or JWTs.
 */
export interface IAuditLog {
  actor: Types.ObjectId;
  action: string;
  detail: Record<string, unknown>;
  ip: string;
  createdAt?: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actor: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: { type: String, required: true, index: true },
    detail: { type: Schema.Types.Mixed, default: {} },
    ip: { type: String, default: "unknown" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.AuditLog || model<IAuditLog>("AuditLog", AuditLogSchema);

export async function writeAuditLog(params: {
  actor: Types.ObjectId | string;
  action: string;
  detail?: Record<string, unknown>;
  req: Request;
}) {
  const ip =
    params.req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    params.req.headers.get("x-real-ip") ||
    "unknown";
  const Model = models.AuditLog || model<IAuditLog>("AuditLog", AuditLogSchema);
  await Model.create({ actor: params.actor, action: params.action, detail: params.detail || {}, ip });
}
