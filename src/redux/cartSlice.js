import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { saveCartToFirebase, loadCartFromFirebase } from "../firebaseConfig";

// Fetch cart from Firebase
export const fetchCartFromFirebase = createAsyncThunk(
  "cart/fetchCart",
  async (userEmail, { rejectWithValue }) => {
    try {
      const cart = await loadCartFromFirebase(userEmail);
      return cart || [];
    } catch (error) {
      console.error("Error loading cart from Firebase:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const { userEmail, product } = action.payload;

      if (!userEmail) {
        console.error("User email is required for adding items to cart.");
        return state;
      }

      const existingItem = state.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.push({ ...product, quantity: 1 });
      }

      try {
        saveCartToFirebase(userEmail, state);
      } catch (error) {
        console.error("Error saving cart to Firebase:", error.message);
      }
    },
    removeFromCart: (state, action) => {
      const { userEmail, productId } = action.payload;

      const updatedCart = state.filter((item) => item.id !== productId);

      try {
        saveCartToFirebase(userEmail, updatedCart);
      } catch (error) {
        console.error(
          "Error removing item from cart in Firebase:",
          error.message
        );
      }

      return updatedCart;
    },
    updateCartQuantity: (state, action) => {
      const { userEmail, productId, quantity } = action.payload;

      const item = state.find((item) => item.id === productId);
      if (item) {
        item.quantity = quantity;

        try {
          saveCartToFirebase(userEmail, state);
        } catch (error) {
          console.error(
            "Error updating cart quantity in Firebase:",
            error.message
          );
        }
      }
    },
    clearCart: (state, action) => {
      const userEmail = action.payload;

      try {
        saveCartToFirebase(userEmail, []);
      } catch (error) {
        console.error("Error clearing cart in Firebase:", error.message);
      }

      return [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartFromFirebase.fulfilled, (state, action) => {
      return action.payload || [];
    });
    builder.addCase(fetchCartFromFirebase.rejected, (state, action) => {
      console.error("Failed to fetch cart:", action.payload);
    });
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
