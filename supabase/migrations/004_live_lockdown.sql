-- Lock down order/download writes to service role only (checkout uses admin client)
DROP POLICY IF EXISTS "Users create own orders" ON public.orders;
DROP POLICY IF EXISTS "Users insert own order items" ON public.order_items;
DROP POLICY IF EXISTS "System inserts downloads" ON public.downloads;

-- Contact form messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins read contact messages" ON public.contact_messages
  FOR SELECT USING (public.is_admin());
