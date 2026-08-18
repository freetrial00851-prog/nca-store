import type { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { fulfillOrder } from "@/app/actions/checkout";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return new Response("Stripe not configured", { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Missing signature", { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      await fulfillOrder(session.id);
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return new Response(message, { status: 400 });
  }
}
