import mongoose, { Schema, models, model } from "mongoose";

/**
 * User Profile Service model (Section 07).
 * Stores accessibility preferences alongside auth identity — these
 * preferences are read by the Accessibility Orchestrator on every
 * /v1/accessibility/assist call.
 */
export interface AccessibilityPreferences {
  primary_disability:
    | "low_vision"
    | "blind"
    | "deaf"
    | "hard_of_hearing"
    | "motor"
    | "cognitive"
    | "none";
  reading_level: "standard" | "simplified";
  output_modalities: ("audio" | "text" | "haptic")[];
}

export interface IUser {
  email: string;
  password_hash: string;
  full_name: string;
  role: "end_user" | "developer";
  preferences: AccessibilityPreferences;
  createdAt?: Date;
}

const PreferencesSchema = new Schema<AccessibilityPreferences>(
  {
    primary_disability: { type: String, default: "none" },
    reading_level: { type: String, default: "standard" },
    output_modalities: { type: [String], default: ["text"] },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    full_name: { type: String, required: true },
    role: { type: String, enum: ["end_user", "developer"], default: "end_user" },
    preferences: { type: PreferencesSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
