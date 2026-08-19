import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, CartItem } from "@/types/database";
import { getEffectivePrice } from "@/lib/utils";

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discountAmount: number;
  drawerOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  addItemAndOpenDrawer: (product: Product) => boolean;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCouponCode: (code: string | null) => void;
  setDiscountAmount: (amount: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
  isInCart: (productId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discountAmount: 0,
      drawerOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return { items: state.items };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        });
      },

      addItemAndOpenDrawer: (product) => {
        const alreadyInCart = get().items.some((i) => i.product.id === product.id);
        if (!alreadyInCart) {
          get().addItem(product);
        }
        set({ drawerOpen: true });
        return !alreadyInCart;
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity: 1 } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: null, discountAmount: 0 }),

      setCouponCode: (code) => set({ couponCode: code }),

      setDiscountAmount: (amount) => set({ discountAmount: amount }),

      openDrawer: () => set({ drawerOpen: true }),

      closeDrawer: () => set({ drawerOpen: false }),

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + getEffectivePrice(item.product) * item.quantity,
          0
        );
      },

      getTotal: () => Math.max(0, get().getSubtotal() - get().discountAmount),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      isInCart: (productId) => {
        return get().items.some((i) => i.product.id === productId);
      },
    }),
    {
      name: "nca-cart",
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
);
