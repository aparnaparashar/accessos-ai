import mongoose, { Schema, models, model } from "mongoose";

/**
 * Developer account model.
 * In the new spec every user is a developer — there is no end-user role,
 * no accessibility preferences, and no role selection at signup.
 */
export interface IUser {
  email: string;
  password_hash: string;
  full_name: string;
  company?: string;
  email_verified: boolean;
  verification_token?: string | null;
  reset_token?: string | null;
  reset_token_expires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    full_name: { type: String, required: true },
    company: { type: String, default: "" },
    email_verified: { type: Boolean, default: false },
    verification_token: { type: String, default: null },
    reset_token: { type: String, default: null },
    reset_token_expires: { type: Date, default: null },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
