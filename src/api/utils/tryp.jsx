import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  startAfter,
} from "firebase/firestore";
import { firestore } from "../../services/firebase";

const fetchData = (collectionName, setData, lastDoc, existingData = []) => {
  const dataCollection = collection(firestore, collectionName);

  // Create a query to order by creation time and limit to 5 documents
  const baseQuery = query(
    dataCollection,
    orderBy("createdAt"),
    startAfter(lastDoc.createdAt),
    limit(5)
  );

  return onSnapshot(baseQuery, (querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Merge the new data with the existing data
    const mergedData = [...existingData, ...newData];

    setData(mergedData);
  });
};

export default fetchData;
