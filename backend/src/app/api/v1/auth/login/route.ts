import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { loginSchema, parseJsonBody } from "@/lib/validation";

/**
 * POST /auth/login
 * Exchanges credentials for an access + refresh token pair.
 */
export async function POST(req: Request) {
  try {
    const parsed = await parseJsonBody(req, loginSchema);
    if (!parsed.ok) return parsed.response;
    const { email, password } = parsed.data;

    await connectDB();
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    const payload = { sub: user._id.toString(), email: user.email };
    return NextResponse.json({
      access_token: signAccessToken(payload),
      refresh_token: signRefreshToken(payload),
      token_type: "bearer",
      user: { id: user._id, email: user.email, full_name: user.full_name },
    });
  } catch (err) {
    return NextResponse.json({ error: "server_error", detail: (err as Error).message }, { status: 500 });
  }
}
