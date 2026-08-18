# NCA — Premium Crochet Pattern Store

A full-stack digital product e-commerce platform built with Next.js, Supabase, Tailwind CSS, and optional Stripe.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without env vars, the app runs in **demo mode** with sample data.

## Go live

See **[DEPLOY.md](./DEPLOY.md)** for the full step-by-step guide:

1. Create a Supabase project
2. Run migrations + seed
3. Set env vars in `.env.local`
4. Deploy to Vercel

**Live without Stripe:** only Supabase + `NEXT_PUBLIC_APP_URL` are required. Checkout saves real orders and grants downloads.

**Add Stripe later:** set Stripe env vars and redeploy for card payments.

## Tech stack

- **Framework:** Next.js 16 (App Router, Server Actions, TypeScript)
- **Database & Auth:** Supabase (PostgreSQL, Auth, RLS, Storage)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Payments:** Stripe Checkout (optional)
- **State:** Zustand (cart & wishlist)
- **Deployment:** Vercel

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Required for live | Notes |
|----------|-------------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only, for admin + order fulfillment |
| `NEXT_PUBLIC_APP_URL` | Yes | `http://localhost:3000` or production URL |
| Stripe keys | No | Add when ready for payments |

## Admin access

After signing up, promote your user in Supabase SQL Editor:

```sql
UPDATE roles SET role = 'admin' WHERE user_id = 'YOUR_USER_UUID';
```

Then open `/admin`.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── shop/               # Product listing
│   ├── products/[slug]/    # Product detail page
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Stripe checkout
│   ├── account/            # Customer portal
│   │   ├── page.tsx        # Dashboard
│   │   ├── orders/         # Order history
│   │   ├── downloads/      # Digital downloads
│   │   ├── wishlist/       # Saved products
│   │   └── settings/       # Account settings
│   └── admin/              # Admin panel (RBAC protected)
│       ├── page.tsx        # Dashboard overview
│       ├── products/       # Product CRUD
│       ├── orders/         # Order management
│       └── coupons/        # Coupon management
├── components/
│   ├── layout/             # Header, Footer, Sidebars
│   ├── products/           # Product cards, grids
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── supabase/           # Supabase client utilities
│   ├── actions/            # Server Actions
│   ├── store/              # Zustand stores
│   └── data/               # Data fetching with mock fallbacks
├── types/                  # TypeScript definitions
supabase/
├── migrations/             # SQL schema & RLS
└── seed.sql                # Sample data
```

## Features

### Storefront
- Hero with search and popular tags
- Category browsing with circular icons
- Product grids (New Arrivals, Bestsellers)
- Product detail page with image gallery, tabs, reviews
- Cart with coupon support
- Stripe checkout integration

### Customer Portal
- Dashboard with stats and recent orders
- Order history with status filtering
- Secure PDF downloads via signed URLs
- Wishlist with "Move All to Cart"
- Account settings (profile, password, notifications)

### Admin Panel
- Revenue and sales overview
- Product CRUD with PDF upload to private storage
- Order management with manual download grants
- Coupon creation and management
- Customer account viewing

### Security
- Row Level Security on all tables
- RBAC for admin routes via middleware
- Private Supabase Storage for pattern PDFs
- 60-second signed URLs for downloads
- Ownership verification before file access

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Forest Green | `#2D4A3E` | Primary buttons, logo, accents |
| Sage Green | `#E8EFE9` | Badges, active states, backgrounds |
| Cream | `#FAF8F5` | Page backgrounds |
| Charcoal | `#1A1A1A` | Headings, primary text |
| Gold | `#F59E0B` | Star ratings |

Typography: Playfair Display (headings) + Inter (body)

## Deploy on Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

The app works with mock data when Supabase is not configured, so you can preview the UI immediately.
