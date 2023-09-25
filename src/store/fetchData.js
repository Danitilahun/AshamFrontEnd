// fetchData.js
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../services/firebase";
import { fetchBranches } from "./branchesSlice";

const setupRealtimeListener = () => {
  return (dispatch) => {
    try {
      const dataCollection = collection(firestore, "branches"); // Replace 'branches' with your collection name
      onSnapshot(dataCollection, (querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(fetchBranches(newData)); // Dispatch the Redux action with the new data
      });
    } catch (error) {
      // Handle any errors here
      console.error("Error setting up real-time listener:", error);
    }
  };
};

export default setupRealtimeListener;
