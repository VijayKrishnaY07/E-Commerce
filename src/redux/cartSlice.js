import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { saveCartToFirebase, loadCartFromFirebase } from "../firebaseConfig";

// Async action to load cart from Firebase
export const fetchCartFromFirebase = createAsyncThunk(
  "cart/fetchCart",
  async (userEmail) => {
    if (!userEmail) {
      throw new Error("❌ No user email provided for loading cart.");
    }
    return await loadCartFromFirebase(userEmail);
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const { userEmail, product } = action.payload;

      if (!product || !product.id || !product.price || !product.image) {
        console.error("❌ Invalid product data. Cannot add to cart:", product);
        return state;
      }

      const existingItem = state.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.push({ ...product, quantity: 1 });
      }

      saveCartToFirebase(userEmail, state); // Save updated cart to Firebase
      return state;
    },
    removeFromCart: (state, action) => {
      const { userEmail, productId } = action.payload;
      const updatedCart = state.filter((item) => item.id !== productId);
      saveCartToFirebase(userEmail, updatedCart);
      return updatedCart;
    },
    updateCartQuantity: (state, action) => {
      const { userEmail, productId, quantity } = action.payload;
      const item = state.find((item) => item.id === productId);
      if (item) {
        item.quantity = quantity;
      }
      saveCartToFirebase(userEmail, state);
    },
    clearCart: (state, action) => {
      const userEmail = action.payload;
      saveCartToFirebase(userEmail, []);
      return [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartFromFirebase.fulfilled, (state, action) => {
      return action.payload || [];
    });
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
