import { NextResponse } from "next/server";
import { requireDeveloper } from "@/lib/requireDeveloper";
import { checkoutSchema, parseJsonBody } from "@/lib/validation";

/**
 * POST /v1/billing/checkout — creates a real Stripe Checkout Session for the
 * requested plan when STRIPE_SECRET_KEY is configured. Otherwise fails
 * closed with {"error":"capability_not_configured"} — same pattern as the
 * AI provider abstraction. Never fakes a successful checkout. Section 10/12.
 *
 * Requires STRIPE_PRICE_STARTER / STRIPE_PRICE_PRO env vars mapping plan
 * names to Stripe Price IDs once Stripe is configured.
 */
export async function POST(req: Request) {
  const auth = requireDeveloper(req);
  if (!auth.ok) return auth.response;

  const parsed = await parseJsonBody(req, checkoutSchema);
  if (!parsed.ok) return parsed.response;

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json(
      {
        error: "capability_not_configured",
        detail: "Set STRIPE_SECRET_KEY (and STRIPE_PRICE_STARTER / STRIPE_PRICE_PRO) to enable real checkout.",
      },
      { status: 501 }
    );
  }

  const priceId =
    parsed.data.plan === "pro" ? process.env.STRIPE_PRICE_PRO : process.env.STRIPE_PRICE_STARTER;
  if (!priceId) {
    return NextResponse.json(
      { error: "capability_not_configured", detail: `No Stripe Price ID configured for plan "${parsed.data.plan}".` },
      { status: 501 }
    );
  }

  try {
    // Dynamic import so the `stripe` package is only required at runtime,
    // once STRIPE_SECRET_KEY is actually set.
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(stripeSecretKey);

    const appUrl = process.env.APP_URL || "http://localhost:4200";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/developer-portal?checkout=success`,
      cancel_url: `${appUrl}/developer-portal?checkout=cancelled`,
      client_reference_id: auth.subject.sub,
    });

    return NextResponse.json({ checkout_url: session.url, session_id: session.id });
  } catch (err) {
    return NextResponse.json({ error: "server_error", detail: (err as Error).message }, { status: 500 });
  }
}
