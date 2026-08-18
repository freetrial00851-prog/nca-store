-- Add min_order_amount to coupons (used by cart validation)
ALTER TABLE public.coupons
  ADD COLUMN IF NOT EXISTS min_order_amount DECIMAL(10, 2) NOT NULL DEFAULT 0;
