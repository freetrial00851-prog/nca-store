export type SkillLevel = 'Beginner' | 'Easy' | 'Intermediate' | 'Advanced';
export type OrderStatus = 'Processing' | 'Completed' | 'Cancelled' | 'Refunded';
export type DiscountType = 'percentage' | 'fixed';
export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  country: string | null;
  language: string | null;
  avatar_url: string | null;
  reward_points: number;
  email_updates: boolean;
  marketing_emails: boolean;
  order_updates: boolean;
  newsletter_subscribed?: boolean;
  newsletter_frequency?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  whats_included: string | null;
  materials: string | null;
  size_info: string | null;
  price: number;
  sale_price: number | null;
  category_id: string | null;
  skill_level: SkillLevel;
  language: string;
  pages_count: number;
  format: string;
  images: string[];
  tags: string[];
  file_url: string | null;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  reviews?: Review[];
  average_rating?: number;
  review_count?: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  payment_method: string | null;
  payment_intent_id: string | null;
  coupon_id: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  price: number;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface Download {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string | null;
  download_count: number;
  last_downloaded_at: string | null;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  profile?: Pick<Profile, 'full_name' | 'avatar_url'>;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: DiscountType;
  value: number;
  min_order_amount: number;
  max_uses: number | null;
  use_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  type: 'shipping' | 'billing';
  full_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Role {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      roles: { Row: Role; Insert: Partial<Role>; Update: Partial<Role> };
      categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category> };
      products: { Row: Product; Insert: Partial<Product>; Update: Partial<Product> };
      orders: { Row: Order; Insert: Partial<Order>; Update: Partial<Order> };
      order_items: { Row: OrderItem; Insert: Partial<OrderItem>; Update: Partial<OrderItem> };
      downloads: { Row: Download; Insert: Partial<Download>; Update: Partial<Download> };
      reviews: { Row: Review; Insert: Partial<Review>; Update: Partial<Review> };
      wishlists: { Row: WishlistItem; Insert: Partial<WishlistItem>; Update: Partial<WishlistItem> };
      coupons: { Row: Coupon; Insert: Partial<Coupon>; Update: Partial<Coupon> };
      addresses: { Row: Address; Insert: Partial<Address>; Update: Partial<Address> };
    };
  };
}
