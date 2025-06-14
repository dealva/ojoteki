//useCartStore.js
import { create } from 'zustand';

const useCartStore = create((set) => ({
  cartItems: [],
  setCartItems: (items) => set({ cartItems: items }),
  addToCart: (item) =>
    set((state) => ({
      cartItems: [...state.cartItems, item],
    })),
  removeFromCart: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.product_id !== productId),
    })),
  clearCart: () => set({ cartItems: [] }),
}));
export default useCartStore;
