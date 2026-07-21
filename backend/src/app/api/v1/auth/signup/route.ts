import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { signupSchema, parseJsonBody } from "@/lib/validation";

/**
 * POST /auth/signup
 * Creates a new developer account. All users are developers.
 */
export async function POST(req: Request) {
  try {
    const parsed = await parseJsonBody(req, signupSchema);
    if (!parsed.ok) return parsed.response;
    const { email, password, full_name } = parsed.data;

    await connectDB();
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "email_taken", detail: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password_hash,
      full_name,
    });

    const payload = { sub: user._id.toString(), email: user.email };
    return NextResponse.json(
      {
        access_token: signAccessToken(payload),
        refresh_token: signRefreshToken(payload),
        token_type: "bearer",
        user: { id: user._id, email: user.email, full_name: user.full_name },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: "server_error", detail: (err as Error).message }, { status: 500 });
  }
}
