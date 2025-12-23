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
    removeFromCart: (itemId: string, model?: string) => void;
    clearCart: () => void;
    isInCart: (itemId: string, model?: string) => boolean;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (item) => {
                const { items } = get();
                const exists = items.some((i) => i.id === item.id && i.model === item.model && i.brand === item.brand);
                if (!exists) {
                    set({ items: [...items, item] });
                }
            },
            removeFromCart: (itemId, model) => {
                set({
                    items: get().items.filter((i) => {
                        if (model) {
                            return !(i.id === itemId && i.model === model);
                        }
                        return i.id !== itemId;
                    })
                });
            },
            clearCart: () => set({ items: [] }),
            isInCart: (itemId, model) => get().items.some((i) => i.id === itemId && (model ? i.model === model : true)),
        }),
        {
            name: 'cart-storage',
        }
    )
);
