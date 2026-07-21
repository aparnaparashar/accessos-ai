import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { requireAuth } from "@/lib/requireAuth";
import { updateProfileSchema, parseJsonBody } from "@/lib/validation";

/**
 * GET  /developer/profile — Return the authenticated user's profile.
 * PUT  /developer/profile — Update full_name, company, etc.
 */
export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const user = await User.findById(auth.subject.sub).select("-password_hash -verification_token -reset_token -reset_token_expires");
  if (!user) {
    return NextResponse.json({ error: "not_found", detail: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    profile: {
      id: user._id,
      email: user.email,
      full_name: user.full_name,
      company: user.company,
      email_verified: user.email_verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}

export async function PUT(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  const parsed = await parseJsonBody(req, updateProfileSchema);
  if (!parsed.ok) return parsed.response;

  await connectDB();
  const user = await User.findById(auth.subject.sub);
  if (!user) {
    return NextResponse.json({ error: "not_found", detail: "User not found" }, { status: 404 });
  }

  if (parsed.data.full_name !== undefined) user.full_name = parsed.data.full_name;
  if (parsed.data.company !== undefined) user.company = parsed.data.company;
  await user.save();

  return NextResponse.json({
    profile: {
      id: user._id,
      email: user.email,
      full_name: user.full_name,
      company: user.company,
      email_verified: user.email_verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}
