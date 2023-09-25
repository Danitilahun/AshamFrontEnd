// branchesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../services/firebase";

const firebaseFunctionToFetchBranches = async () => {
  const dataCollection = collection(firestore, "branches");
  const querySnapshot = await getDocs(dataCollection);
  const branchesData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return branchesData;
};

// export default firebaseFunctionToFetchBranches;

export const fetchBranches = createAsyncThunk(
  "branches/fetchBranches",
  async () => {
    try {
      // Replace with your Firebase setup and fetching logic
      const response = await firebaseFunctionToFetchBranches();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const branchesSlice = createSlice({
  name: "branches",
  initialState: { branches: [], loading: false, error: null },
  reducers: {
    // Add other reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default branchesSlice.reducer;
