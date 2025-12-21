import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image?: string;
    brand?: string;
    model?: string;
    fuelType?: string;
}

interface CartState {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    isInCart: (itemId: string) => boolean;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (item) => {
                const { items } = get();
                if (!items.some((i) => i.id === item.id)) {
                    set({ items: [...items, item] });
                }
            },
            removeFromCart: (itemId) => {
                set({ items: get().items.filter((i) => i.id !== itemId) });
            },
            clearCart: () => set({ items: [] }),
            isInCart: (itemId) => get().items.some((i) => i.id === itemId),
        }),
        {
            name: 'cart-storage',
        }
    )
);
