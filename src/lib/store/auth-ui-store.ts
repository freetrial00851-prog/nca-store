import { create } from "zustand";
import type { AuthIntent } from "@/lib/auth-intent";

type AuthModalView = "signin" | "signup";

interface AuthUiState {
  modalOpen: boolean;
  modalView: AuthModalView;
  modalMessage: string | null;
  pendingIntent: Omit<AuthIntent, "createdAt"> | null;
  openAuthModal: (options?: {
    view?: AuthModalView;
    message?: string;
    intent?: Omit<AuthIntent, "createdAt">;
  }) => void;
  closeAuthModal: () => void;
  setModalView: (view: AuthModalView) => void;
}

export const useAuthUiStore = create<AuthUiState>((set) => ({
  modalOpen: false,
  modalView: "signin",
  modalMessage: null,
  pendingIntent: null,

  openAuthModal: (options) =>
    set({
      modalOpen: true,
      modalView: options?.view ?? "signin",
      modalMessage: options?.message ?? null,
      pendingIntent: options?.intent ?? null,
    }),

  closeAuthModal: () =>
    set({
      modalOpen: false,
      modalMessage: null,
      pendingIntent: null,
    }),

  setModalView: (view) => set({ modalView: view }),
}));
