import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  where,
} from "firebase/firestore";
import { firestore } from "../../services/firebase";

const fetchFirestoreDataWithFilter = (
  collectionName,
  lastDoc,
  limitNumber,
  existingData,
  setData,
  fieldToFilter1,
  valueToMatch1,
  fieldToFilter2, // Add a second filtering criterion
  valueToMatch2 // Add a second filtering criterion
) => {
  const dataCollection = collection(firestore, collectionName);

  let firestoreQuery = query(dataCollection, orderBy("createdAt", "desc"));

  if (fieldToFilter1 && valueToMatch1 !== undefined) {
    firestoreQuery = query(
      firestoreQuery,
      where(fieldToFilter1, "==", valueToMatch1)
    );
  }

  // Add the second filtering criterion if provided
  if (fieldToFilter2 && valueToMatch2 !== undefined) {
    firestoreQuery = query(
      firestoreQuery,
      where(fieldToFilter2, "==", valueToMatch2)
    );
  }

  if (lastDoc) {
    firestoreQuery = query(firestoreQuery, startAfter(lastDoc.createdAt));
  }

  if (limitNumber) {
    firestoreQuery = query(firestoreQuery, limit(limitNumber));
  }

  return onSnapshot(firestoreQuery, (querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Merge the new data with the existing data
    const mergedData = lastDoc ? [...existingData, ...newData] : newData;
    setData(mergedData);
  });
};

export default fetchFirestoreDataWithFilter;
