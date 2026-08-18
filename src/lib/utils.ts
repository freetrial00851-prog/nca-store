import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getEffectivePrice(product: { price: number; sale_price: number | null }): number {
  return product.sale_price ?? product.price;
}

export function calculateDiscount(
  subtotal: number,
  coupon: { discount_type: "percentage" | "fixed"; value: number; min_order_amount?: number }
): number {
  if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
    return 0;
  }
  if (coupon.discount_type === "percentage") {
    return subtotal * (coupon.value / 100);
  }
  return Math.min(coupon.value, subtotal);
}
