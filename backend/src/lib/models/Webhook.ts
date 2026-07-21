import mongoose, { Schema, models, model, Types } from "mongoose";

/**
 * Webhook model — belongs to a Project.
 * Supports: Create/Edit/Delete, Enable/Disable, Secret, Retry policy,
 * Delivery history.
 */

export interface IWebhookDelivery {
  event: string;
  status_code: number;
  response_body?: string;
  delivered_at: Date;
  success: boolean;
}

export interface IWebhook {
  project: Types.ObjectId;
  url: string;
  secret: string;
  events: string[];
  enabled: boolean;
  retry_policy: {
    max_retries: number;
    retry_interval_seconds: number;
  };
  delivery_history: IWebhookDelivery[];
  createdAt?: Date;
  updatedAt?: Date;
}

const WebhookDeliverySchema = new Schema<IWebhookDelivery>(
  {
    event: { type: String, required: true },
    status_code: { type: Number, required: true },
    response_body: { type: String, default: "" },
    delivered_at: { type: Date, required: true },
    success: { type: Boolean, required: true },
  },
  { _id: false }
);

const WebhookSchema = new Schema<IWebhook>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    url: { type: String, required: true },
    secret: { type: String, required: true },
    events: { type: [String], default: ["request.completed", "request.failed"] },
    enabled: { type: Boolean, default: true },
    retry_policy: {
      type: {
        max_retries: { type: Number, default: 3 },
        retry_interval_seconds: { type: Number, default: 60 },
      },
      default: { max_retries: 3, retry_interval_seconds: 60 },
    },
    delivery_history: { type: [WebhookDeliverySchema], default: [] },
  },
  { timestamps: true }
);

export default models.Webhook || model<IWebhook>("Webhook", WebhookSchema);
