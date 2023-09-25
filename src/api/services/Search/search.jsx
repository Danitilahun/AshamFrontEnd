import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../../../services/firebase";

const search = (collectionName, filters, setData) => {
  const dataCollection = collection(firestore, collectionName);

  // Build the query using the provided filters
  let queryRef = dataCollection;
  filters.forEach((filter) => {
    const { field, operator, value } = filter;
    queryRef = query(queryRef, where(field, operator, value));
  });

  return onSnapshot(queryRef, (querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setData(newData); // No need for collectionName check
  });
};

export default search;
