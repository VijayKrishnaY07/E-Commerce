import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice"; // Ensure the cart reducer is correctly imported

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;
