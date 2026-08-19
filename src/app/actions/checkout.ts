"use server";

import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { stripe, formatAmountForStripe } from "@/lib/stripe";
import { calculateDiscount } from "@/lib/utils";
import { isDemoMode, isStripeConfigured } from "@/lib/demo-mode";
import { MOCK_COUPONS } from "@/lib/data/mock-data";
import type { Product, Order, Coupon } from "@/types/database";

interface CheckoutItem {
  product: Product;
  quantity: number;
}

async function resolveCheckoutItems(items: CheckoutItem[]): Promise<CheckoutItem[]> {
  const supabase = await createClient();
  const productIds = [...new Set(items.map((i) => i.product.id))];

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds)
    .eq("is_active", true);

  if (error || !products?.length) {
    throw new Error("This product is currently unavailable.");
  }

  return items.map((item) => {
    const dbProduct = products.find((p) => p.id === item.product.id);
    if (!dbProduct) {
      throw new Error("This product is currently unavailable.");
    }
    return { product: dbProduct as Product, quantity: 1 };
  });
}

export async function createCheckoutSession(
  items: CheckoutItem[],
  couponCode?: string | null
) {
  if (items.length === 0) {
    throw new Error("Cart is empty");
  }

  if (isDemoMode()) {
    return { url: "/checkout/success?demo=1" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/checkout");
  }

  const verifiedItems = await resolveCheckoutItems(items);

  if (!isStripeConfigured()) {
    const orderId = await createManualOrder(verifiedItems, couponCode, user.id);
    return { url: `/checkout/success?order_id=${orderId}` };
  }

  let subtotal = verifiedItems.reduce(
    (sum, item) =>
      sum + (item.product.sale_price ?? item.product.price) * item.quantity,
    0
  );

  let discountAmount = 0;
  let couponId: string | null = null;

  if (couponCode) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponCode.toUpperCase())
      .eq("is_active", true)
      .single();

    if (coupon) {
      discountAmount = calculateDiscount(subtotal, coupon);
      couponId = coupon.id;
    }
  }

  const total = Math.max(0, subtotal - discountAmount);

  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const lineItems = verifiedItems.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.product.title,
        description: "Digital Crochet Pattern PDF",
      },
      unit_amount: formatAmountForStripe(
        item.product.sale_price ?? item.product.price
      ),
    },
    quantity: item.quantity,
  }));

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items: lineItems,
    discounts:
      discountAmount > 0
        ? [{ coupon: await getOrCreateStripeCoupon(couponCode!, discountAmount, subtotal) }]
        : undefined,
    metadata: {
      user_id: user.id,
      coupon_id: couponId ?? "",
      item_ids: verifiedItems.map((i) => i.product.id).join(","),
    },
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/cart`,
  });

  return { url: session.url };
}

async function createManualOrder(
  items: CheckoutItem[],
  couponCode: string | null | undefined,
  userId: string
): Promise<string> {
  const admin = await createAdminClient();

  let subtotal = items.reduce(
    (sum, item) =>
      sum + (item.product.sale_price ?? item.product.price) * item.quantity,
    0
  );

  let discountAmount = 0;
  let couponId: string | null = null;

  if (couponCode) {
    const { data: coupon } = await admin
      .from("coupons")
      .select("*")
      .eq("code", couponCode.toUpperCase())
      .eq("is_active", true)
      .single();

    if (coupon) {
      discountAmount = calculateDiscount(subtotal, coupon);
      couponId = coupon.id;

      await admin
        .from("coupons")
        .update({ use_count: coupon.use_count + 1 })
        .eq("id", coupon.id);
    }
  }

  const total = Math.max(0, subtotal - discountAmount);

  const { data: order, error } = await admin
    .from("orders")
    .insert({
      user_id: userId,
      status: "Completed",
      subtotal,
      discount_amount: discountAmount,
      tax_amount: 0,
      total_amount: total,
      payment_method: "manual",
      payment_intent_id: null,
      coupon_id: couponId,
    })
    .select("id")
    .single();

  if (error || !order) {
    throw new Error("Failed to create order");
  }

  for (const item of items) {
    const price = item.product.sale_price ?? item.product.price;

    await admin.from("order_items").insert({
      order_id: order.id,
      product_id: item.product.id,
      price,
      quantity: item.quantity,
    });

    await admin.from("downloads").upsert(
      {
        user_id: userId,
        product_id: item.product.id,
        order_id: order.id,
        download_count: 0,
      },
      { onConflict: "user_id,product_id,order_id" }
    );
  }

  return order.id;
}

async function getOrCreateStripeCoupon(
  code: string,
  discountAmount: number,
  subtotal: number
): Promise<string> {
  if (!stripe) throw new Error("Stripe is not configured");
  const percentOff = Math.round((discountAmount / subtotal) * 100);
  const coupon = await stripe.coupons.create({
    percent_off: percentOff,
    duration: "once",
    name: code,
  });
  return coupon.id;
}

export async function fulfillOrder(
  sessionId: string,
  isDemo = false
): Promise<Order | null> {
  if (isDemo || sessionId === "demo") {
    return {
      id: `NCA-${Date.now()}`,
      user_id: "demo",
      status: "Completed",
      subtotal: 0,
      discount_amount: 0,
      tax_amount: 0,
      total_amount: 0,
      payment_method: "demo",
      payment_intent_id: null,
      coupon_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  if (!stripe) throw new Error("Stripe is not configured");

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed");
  }

  const userId = session.metadata?.user_id;
  const productIds = session.metadata?.item_ids?.split(",") ?? [];
  if (!userId) throw new Error("Missing user metadata");

  const admin = await createAdminClient();

  const paymentIntentId = session.payment_intent as string;
  const { data: existing } = await admin
    .from("orders")
    .select("*")
    .eq("payment_intent_id", paymentIntentId)
    .maybeSingle();

  if (existing) return existing as Order;

  const subtotal = (session.amount_subtotal ?? 0) / 100;
  const total = (session.amount_total ?? 0) / 100;
  const discount = subtotal - total;

  const { data: order } = await admin
    .from("orders")
    .insert({
      user_id: userId,
      status: "Completed",
      subtotal,
      discount_amount: discount,
      tax_amount: 0,
      total_amount: total,
      payment_method: "stripe",
      payment_intent_id: paymentIntentId,
      coupon_id: session.metadata?.coupon_id || null,
    })
    .select()
    .single();

  if (!order) throw new Error("Failed to create order");

  for (const productId of productIds) {
    const { data: product } = await admin
      .from("products")
      .select("price, sale_price")
      .eq("id", productId)
      .single();

    await admin.from("order_items").insert({
      order_id: order.id,
      product_id: productId,
      price: product?.sale_price ?? product?.price ?? 0,
      quantity: 1,
    });

    await admin.from("downloads").upsert(
      {
        user_id: userId,
        product_id: productId,
        order_id: order.id,
        download_count: 0,
      },
      { onConflict: "user_id,product_id,order_id" }
    );
  }

  return order;
}

export async function getOrderByOrderId(orderId: string): Promise<Order | null> {
  if (isDemoMode()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  return order;
}

export async function validateCoupon(code: string): Promise<
  | { valid: true; coupon: Coupon }
  | { valid: false; message: string }
> {
  if (isDemoMode()) {
    const coupon = MOCK_COUPONS.find((c) => c.code === code.toUpperCase());
    if (!coupon) return { valid: false, message: "Invalid coupon code" };
    return { valid: true, coupon };
  }

  const supabase = await createClient();
  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (!coupon) return { valid: false, message: "Invalid coupon code" };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, message: "Coupon has expired" };
  }
  if (coupon.max_uses && coupon.use_count >= coupon.max_uses) {
    return { valid: false, message: "Coupon usage limit reached" };
  }

  return { valid: true, coupon };
}
