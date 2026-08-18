import type { Product, Review } from "@/types/database";
import { MOCK_PRODUCTS } from "./mock-data";

export interface MockOrder {
  id: string;
  status: "Completed" | "Processing" | "Cancelled" | "Refunded";
  total_amount: number;
  subtotal: number;
  discount_amount: number;
  created_at: string;
  item_count: number;
  product_ids: string[];
}

export const MOCK_PROFILE = {
  id: "demo-user",
  full_name: "Sarah Johnson",
  email: "sarah@example.com",
  phone: "+1 (555) 123-4567",
  date_of_birth: "1990-05-15",
  country: "United States",
  language: "English",
  avatar_url: null,
  reward_points: 230,
  email_updates: true,
  marketing_emails: true,
  order_updates: true,
  newsletter_subscribed: true,
  newsletter_frequency: "weekly",
  created_at: "2023-06-01T00:00:00Z",
  updated_at: "2024-03-01T00:00:00Z",
};

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: "NCA-1250",
    status: "Completed",
    total_amount: 13.97,
    subtotal: 15.97,
    discount_amount: 2.0,
    created_at: "2024-03-15T10:30:00Z",
    item_count: 3,
    product_ids: ["p1", "p2", "p5"],
  },
  {
    id: "NCA-1248",
    status: "Completed",
    total_amount: 4.99,
    subtotal: 4.99,
    discount_amount: 0,
    created_at: "2024-03-10T14:20:00Z",
    item_count: 1,
    product_ids: ["p1"],
  },
  {
    id: "NCA-1245",
    status: "Completed",
    total_amount: 9.48,
    subtotal: 9.48,
    discount_amount: 0,
    created_at: "2024-03-05T09:15:00Z",
    item_count: 2,
    product_ids: ["p3", "p4"],
  },
  {
    id: "NCA-1240",
    status: "Processing",
    total_amount: 7.98,
    subtotal: 7.98,
    discount_amount: 0,
    created_at: "2024-02-28T16:00:00Z",
    item_count: 2,
    product_ids: ["p2", "p6"],
  },
];

export function getMockOrder(id: string): MockOrder | undefined {
  return MOCK_ORDERS.find((o) => o.id === id);
}

export function getMockOrderProducts(order: MockOrder): Product[] {
  return order.product_ids
    .map((pid) => MOCK_PRODUCTS.find((p) => p.id === pid))
    .filter((p): p is Product => Boolean(p));
}

export function getMockDownloads(): Product[] {
  return MOCK_PRODUCTS.filter((p) =>
    ["p1", "p2", "p3", "p5", "p6"].includes(p.id)
  );
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    product_id: "p1",
    user_id: "demo-user",
    rating: 5,
    comment: "Absolutely adorable pattern! The step-by-step photos made it so easy to follow. My niece loves her bunny lovey.",
    created_at: "2024-02-20T00:00:00Z",
    updated_at: "2024-02-20T00:00:00Z",
    profile: { full_name: "Emily R.", avatar_url: null },
  },
  {
    id: "r2",
    product_id: "p1",
    user_id: "u2",
    rating: 5,
    comment: "Perfect beginner-friendly pattern. Clear instructions and beautiful result!",
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
    profile: { full_name: "Maria L.", avatar_url: null },
  },
  {
    id: "r3",
    product_id: "p1",
    user_id: "u3",
    rating: 4,
    comment: "Great pattern overall. Would love more color variation suggestions.",
    created_at: "2023-12-05T00:00:00Z",
    updated_at: "2023-12-05T00:00:00Z",
    profile: { full_name: "Jessica T.", avatar_url: null },
  },
  {
    id: "r4",
    product_id: "p2",
    user_id: "u4",
    rating: 5,
    comment: "My favorite tote pattern! Sturdy and stylish.",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
    profile: { full_name: "Anna K.", avatar_url: null },
  },
  {
    id: "r5",
    product_id: "p3",
    user_id: "u5",
    rating: 5,
    comment: "So cute for summer! Got lots of compliments.",
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
    profile: { full_name: "Sophie M.", avatar_url: null },
  },
];

export function getMockReviewsForProduct(productId: string): Review[] {
  return MOCK_REVIEWS.filter((r) => r.product_id === productId);
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  published_at: string;
  read_time: string;
  image: string;
}

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    slug: "beginner-amigurumi-tips",
    title: "5 Essential Tips for Beginner Amigurumi Makers",
    excerpt: "Starting your first amigurumi project? These tips will help you create adorable creatures with confidence.",
    category: "Tutorials",
    author: "NCA Team",
    published_at: "2024-03-10T00:00:00Z",
    read_time: "5 min read",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop",
    content: `Amigurumi is one of the most rewarding crochet techniques — small, quick projects that make perfect gifts. Here are our top tips for beginners.

**1. Master the magic ring.** A tight starting circle prevents stuffing from showing through. Practice until your center closes completely.

**2. Use stitch markers.** Mark the first stitch of every round. In amigurumi you work in continuous spirals with no join, so markers are essential.

**3. Keep tension consistent.** Uneven tension creates lumpy shapes. Relax your hands and aim for uniform stitches throughout.

**4. Stuff firmly but evenly.** Under-stuffed pieces look floppy; over-stuffed ones can split stitches. Add stuffing gradually and shape as you go.

**5. Weave in ends securely.** Hidden ends prevent unraveling over time. Weave through several stitches in different directions before trimming.

Ready to try? Our Baby Bunny Lovey pattern is the perfect first amigurumi project — rated Easy with 40+ step-by-step photos.`,
  },
  {
    slug: "choosing-yarn-for-crochet",
    title: "How to Choose the Right Yarn for Your Crochet Project",
    excerpt: "Cotton, acrylic, or wool? Learn which fiber works best for bags, wearables, and home decor patterns.",
    category: "Materials",
    author: "NCA Team",
    published_at: "2024-02-28T00:00:00Z",
    read_time: "7 min read",
    image: "https://images.unsplash.com/photo-1593693395680-d8974b4d8f26?w=800&h=450&fit=crop",
    content: `The right yarn can make or break your finished project. Here's a quick guide by project type.

**Bags & totes:** Cotton yarn is ideal — it's durable, holds shape, and won't stretch out with use. Look for worsted or DK weight cotton.

**Wearables:** Soft acrylic or cotton blends work well. Choose yarns labeled as machine-washable for everyday items like hats and cardigans.

**Home decor:** Cotton for coasters and trivets (heat resistant), acrylic for decorative pieces where drape matters less.

**Amigurumi:** DK or light worsted cotton or acrylic. Avoid fuzzy yarns — they hide stitch definition and make counting difficult.

Always check your pattern's recommended yarn weight and hook size. Substituting is fine, but swatch first to check gauge.`,
  },
  {
    slug: "spring-pattern-roundup",
    title: "Spring 2024 Pattern Roundup: Fresh Makes for the Season",
    excerpt: "From daisy bucket hats to sunflower coasters — our favorite patterns to crochet this spring.",
    category: "Inspiration",
    author: "NCA Team",
    published_at: "2024-02-15T00:00:00Z",
    read_time: "4 min read",
    image: "https://images.unsplash.com/photo-1582794543139-688e9a4a0046?w=800&h=450&fit=crop",
    content: `Spring is here and we're ready to make! Here are our top picks from the NCA collection this season.

**Daisy Bucket Hat** — A sunny staple for garden days and farmers markets. Rated Easy, works up in a weekend.

**Sunflower Coaster Set** — Free pattern alert! Brighten your table with this beginner-friendly set of four coasters.

**Baby Bunny Lovey** — Perfect for Easter gifts. Soft, snuggly, and always a crowd-pleaser.

**Granny Square Tote** — On sale now! A classic technique with a modern bag shape — great for market runs.

Browse the full collection in our shop and filter by skill level to find your perfect spring project.`,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return MOCK_BLOG_POSTS.find((p) => p.slug === slug);
}

export interface MockAddress {
  id: string;
  type: "shipping" | "billing";
  full_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
}

export const MOCK_ADDRESSES: MockAddress[] = [
  {
    id: "1",
    type: "shipping",
    full_name: "Sarah Johnson",
    address_line1: "123 Main Street",
    address_line2: "Apt 4B",
    city: "New York",
    state: "NY",
    postal_code: "10001",
    country: "United States",
    phone: "+1 (555) 123-4567",
    is_default: true,
  },
  {
    id: "2",
    type: "billing",
    full_name: "Sarah Johnson",
    address_line1: "456 Oak Avenue",
    address_line2: null,
    city: "Brooklyn",
    state: "NY",
    postal_code: "11201",
    country: "United States",
    phone: "+1 (555) 987-6543",
    is_default: false,
  },
];

export const MOCK_CUSTOMERS = [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", orders: 4, spent: 36.44, joined: "2023-06-01T00:00:00Z" },
  { id: "2", name: "Emily Rodriguez", email: "emily@email.com", orders: 8, spent: 54.2, joined: "2023-09-22T00:00:00Z" },
  { id: "3", name: "Maria Lopez", email: "maria@email.com", orders: 15, spent: 112.8, joined: "2023-03-10T00:00:00Z" },
];
