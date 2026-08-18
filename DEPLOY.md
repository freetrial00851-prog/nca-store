# Live Deployment Guide — NCA Store

This guide takes the store from **demo mode** (mock data) to a **live Supabase-backed deployment** on Vercel — without Stripe if you are not ready for payments yet.

## Deployment phases

| Phase | What you get | Required env vars |
|-------|----------------|-------------------|
| **Demo** | Full UI, mock data, demo login/checkout | None |
| **Live (no payments)** | Real auth, products, orders, downloads, admin | Supabase + `NEXT_PUBLIC_APP_URL` |
| **Live + Stripe** | Card payments via Stripe Checkout | Above + Stripe keys + webhook |

---

## Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. Open **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose to client)

---

## Step 2 — Run database migrations

In the Supabase **SQL Editor**, run these files **in order**:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_coupon_min_order.sql`
4. `supabase/seed.sql` (sample categories, products, coupons)

Or paste the combined script: `supabase/setup-live.sql`

---

## Step 3 — Create storage buckets

In Supabase **Storage**, create:

| Bucket | Public? | Purpose |
|--------|---------|---------|
| `pattern-files` | **No** (private) | PDF pattern files — accessed via signed URLs |
| `product-images` | **Yes** | Product gallery images |

Upload pattern PDFs to `pattern-files/patterns/{slug}.pdf` and set each product's `file_url` column to match (e.g. `patterns/baby-bunny-lovey.pdf`).

---

## Step 4 — Configure auth

In Supabase **Authentication → URL Configuration**:

- **Site URL**: your production URL (e.g. `https://nca-store.vercel.app`)
- **Redirect URLs**: add `http://localhost:3000/**` for local dev and your production URL

For local dev, disable email confirmation under **Authentication → Providers → Email** (optional, speeds up testing).

---

## Step 5 — Local environment

```bash
cp .env.example .env.local
```

Fill in at minimum:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Then:

```bash
npm install
npm run dev
```

Sign up at `/auth/signup`, then promote your user to admin:

```sql
UPDATE roles SET role = 'admin' WHERE user_id = 'YOUR_USER_UUID';
```

Find your UUID in **Authentication → Users** in Supabase.

---

## Step 6 — Deploy to Vercel

### Option A — One script (recommended)

After logging in once:

```powershell
gh auth login
npx vercel login
.\scripts\deploy-live.ps1 -GitHubUser krwao
```

Replace `krwao` with your GitHub username if different.

### Option B — Manual

1. Push to GitHub:
   ```powershell
   gh auth login
   gh repo create krwao/nca-store --public --source=. --remote=origin --push
   ```
   Or if the repo already exists:
   ```powershell
   git remote add origin https://github.com/krwao/nca-store.git
   git push -u origin main
   ```

2. Import the repo at [vercel.com/new](https://vercel.com/new) **or** deploy from CLI:
   ```powershell
   npx vercel login
   npx vercel --prod
   ```

3. In Vercel → **Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` = your Vercel URL (e.g. `https://nca-store.vercel.app`)

4. **Redeploy** after setting env vars.

5. In Supabase → **Authentication → URL Configuration**:
   - **Site URL** = your Vercel URL
   - **Redirect URLs** = `https://your-app.vercel.app/**`

After deploy, update Supabase **Site URL** and **Redirect URLs** to match your Vercel domain.

---

## Step 7 — Test the live flow

1. Browse `/shop` — products load from Supabase.
2. Sign up / sign in — real Supabase auth (middleware protects `/account` and `/admin`).
3. Add to cart → checkout → **Complete Order** (no Stripe needed).
4. Order appears in `/account/orders` and `/admin/orders`.
5. Downloads appear in `/account/downloads` (requires PDF in `pattern-files` bucket).

Coupons from seed: `WELCOME10` (10% off), `SAVE5` ($5 off orders $15+).

---

## Step 8 — Add Stripe later (optional)

When ready for card payments:

1. Create a [Stripe](https://stripe.com) account.
2. Add to Vercel env:
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. Create a webhook in Stripe Dashboard pointing to:
   ```
   https://your-domain.vercel.app/api/webhooks/stripe
   ```
4. Listen for `checkout.session.completed`.
5. Redeploy — checkout button switches to **Pay with Stripe**.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Still seeing demo banner | Supabase env vars missing or not deployed — check Vercel env + redeploy |
| Admin redirects to home | User lacks admin role — run the `UPDATE roles` SQL |
| Checkout asks for login | Expected in live mode — sign in first |
| Downloads fail | Upload PDF to `pattern-files` and set `products.file_url` |
| Images not loading | Upload to `product-images` bucket or use Unsplash URLs |

---

## Environment variable reference

See `.env.example` for the full list. Only Supabase + app URL are required for live mode without payments.
