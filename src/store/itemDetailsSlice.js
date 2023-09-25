// itemDetailsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../services/firebase";

const initialState = {
  selectedItemId: null,
  selectedItem: null,
  loading: false,
};

const itemDetailsSlice = createSlice({
  name: "itemDetails",
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload.item;
      state.selectedItemId = action.payload.itemId;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSelectedItem, setLoading } = itemDetailsSlice.actions;

export const listenToItemDetails = (itemId) => (dispatch) => {
  const itemDocRef = doc(firestore, "branches", itemId);
  const unsubscribe = onSnapshot(itemDocRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      dispatch(
        setSelectedItem({
          item: { ...docSnapshot.data(), id: docSnapshot.id },
          itemId,
        })
      );
    } else {
      dispatch(setSelectedItem({ item: null, itemId: null }));
    }
    dispatch(setLoading(false));
  });

  return () => unsubscribe();
};

export default itemDetailsSlice.reducer;
