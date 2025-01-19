import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  saveFavoritesToFirebase,
  loadFavoritesFromFirebase,
} from "../firebaseConfig";

// Fetch favorites from Firebase
export const fetchFavoritesFromFirebase = createAsyncThunk(
  "favorites/fetchFavorites",
  async (userEmail, { rejectWithValue }) => {
    try {
      const favorites = await loadFavoritesFromFirebase(userEmail);
      return favorites || [];
    } catch (error) {
      console.error("Error loading favorites from Firebase:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: [],
  reducers: {
    toggleFavorite: (state, action) => {
      const { userEmail, product } = action.payload;

      if (!userEmail) {
        console.error("User email is required for Firestore operations.");
        return state;
      }

      const existingIndex = state.findIndex((item) => item.id === product.id);

      if (existingIndex !== -1) {
        state.splice(existingIndex, 1); // Remove from favorites
      } else {
        state.push(product); // Add to favorites
      }

      try {
        saveFavoritesToFirebase(userEmail, state);
      } catch (error) {
        console.error("Error saving favorites to Firebase:", error.message);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFavoritesFromFirebase.fulfilled, (state, action) => {
      return action.payload || [];
    });
    builder.addCase(fetchFavoritesFromFirebase.rejected, (state, action) => {
      console.error("Failed to fetch favorites:", action.payload);
    });
  },
});

export const { toggleFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;
