-- NCA Store - Row Level Security Policies

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Roles
CREATE POLICY "Users can read own role" ON public.roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.roles
  FOR ALL USING (public.is_admin());

-- Profiles
CREATE POLICY "Public profiles readable by owner" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins manage profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Categories (public read)
CREATE POLICY "Categories are publicly readable" ON public.categories
  FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- Products (public read active)
CREATE POLICY "Active products publicly readable" ON public.products
  FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins manage products" ON public.products
  FOR ALL USING (public.is_admin());

-- Orders
CREATE POLICY "Users read own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage orders" ON public.orders
  FOR ALL USING (public.is_admin());

-- Order items
CREATE POLICY "Users read own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );
CREATE POLICY "Users insert own order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );
CREATE POLICY "Admins manage order items" ON public.order_items
  FOR ALL USING (public.is_admin());

-- Downloads
CREATE POLICY "Users read own downloads" ON public.downloads
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "System inserts downloads" ON public.downloads
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users update own download count" ON public.downloads
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage downloads" ON public.downloads
  FOR ALL USING (public.is_admin());

-- Reviews
CREATE POLICY "Reviews publicly readable" ON public.reviews
  FOR SELECT USING (true);
CREATE POLICY "Users create own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage reviews" ON public.reviews
  FOR ALL USING (public.is_admin());

-- Wishlists
CREATE POLICY "Users manage own wishlist" ON public.wishlists
  FOR ALL USING (auth.uid() = user_id);

-- Coupons (public read active for validation)
CREATE POLICY "Active coupons readable" ON public.coupons
  FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins manage coupons" ON public.coupons
  FOR ALL USING (public.is_admin());

-- Addresses
CREATE POLICY "Users manage own addresses" ON public.addresses
  FOR ALL USING (auth.uid() = user_id);

-- Payment methods
CREATE POLICY "Users manage own payment methods" ON public.payment_methods
  FOR ALL USING (auth.uid() = user_id);

-- Storage bucket policies (run separately in Supabase dashboard or via API)
-- Bucket: pattern-files (private)
-- Bucket: product-images (public)
