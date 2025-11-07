import { create } from 'zustand';

interface PasswordResetStore {
  resetToken: string | null;
  email: string | null;
  setResetToken: (token: string | null, email: string | null) => void;
  clearResetToken: () => void;
}

export const usePasswordResetStore = create<PasswordResetStore>((set) => ({
  resetToken: null,
  email: null,
  setResetToken: (token, email) => set({ resetToken: token, email }),
  clearResetToken: () => set({ resetToken: null, email: null }),
}));
