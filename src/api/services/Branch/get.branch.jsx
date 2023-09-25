import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../../../services/firebase";
const fetchBranches = (setBranches) => {
  const branchesCollection = collection(firestore, "branches");
  return onSnapshot(branchesCollection, (querySnapshot) => {
    const newBranch = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBranches(newBranch);
  });
};

export default fetchBranches;
