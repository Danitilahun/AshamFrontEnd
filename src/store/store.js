// rootReducer.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import branchesReducer from "./branchesSlice";
import itemDetailsReducer from "./itemDetailsSlice";

const rootReducer = combineReducers({
  branches: branchesReducer,
  itemDetails: itemDetailsReducer,
  // Add other reducers here if needed
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
