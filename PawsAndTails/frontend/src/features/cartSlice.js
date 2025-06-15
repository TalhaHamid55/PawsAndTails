// redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Get cart from localStorage initially
const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

// Save to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const initialState = {
  items: getCartFromStorage(), // array of { productId, name, price, quantity, image }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === newItem.productId
      );
      debugger;
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        toast.success(`${newItem.name} Quantity Updated`);
      } else {
        state.items.push(newItem);
        toast.success(`${newItem.name} Added to Cart`);
      }

      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
      saveCartToStorage([...state.items]);
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
    refreshCartFromStorage: (state) => {
      const cart = localStorage.getItem("cart");
      state.items = cart ? JSON.parse(cart) : [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  refreshCartFromStorage,
} = cartSlice.actions;

export default cartSlice.reducer;
