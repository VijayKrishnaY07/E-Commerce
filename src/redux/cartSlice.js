import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { saveCartToFirebase, loadCartFromFirebase } from "../firebaseConfig";

// Async action to load cart from Firebase
export const fetchCartFromFirebase = createAsyncThunk(
  "cart/fetchCart",
  async (userEmail) => {
    return await loadCartFromFirebase(userEmail);
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const { userEmail, product } = action.payload;
      if (!userEmail) {
        console.error("❌ No user email provided. Cannot save cart.");
        return;
      }

      const existingItem = state.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.push({ ...product, quantity: 1 });
      }

      console.log("🛒 Saving cart for:", userEmail);
      saveCartToFirebase(userEmail, state);
    },
    removeFromCart: (state, action) => {
      const { userEmail, productId } = action.payload;
      if (!userEmail) {
        console.error("❌ No user email provided. Cannot remove item.");
        return;
      }

      const updatedCart = state.filter((item) => item.id !== productId);
      saveCartToFirebase(userEmail, updatedCart);
      return updatedCart;
    },
    updateCartQuantity: (state, action) => {
      const { userEmail, productId, quantity } = action.payload;
      if (!userEmail) {
        console.error("❌ No user email provided. Cannot update cart.");
        return;
      }

      const item = state.find((item) => item.id === productId);
      if (item) {
        item.quantity = quantity;
      }
      saveCartToFirebase(userEmail, state);
    },
    clearCart: (state, action) => {
      const userEmail = action.payload;
      if (!userEmail) {
        console.error("❌ No user email provided. Cannot clear cart.");
        return [];
      }

      console.log("🗑️ Clearing cart for:", userEmail);
      saveCartToFirebase(userEmail, []); // ✅ Clear from Firebase
      return [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartFromFirebase.fulfilled, (state, action) => {
      return action.payload; // Load cart from Firebase
    });
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
