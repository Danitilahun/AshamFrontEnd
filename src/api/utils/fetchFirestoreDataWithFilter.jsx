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
  fieldToFilter,
  valueToMatch,
  match = "createdAt",
  way = "desc"
) => {
  const dataCollection = collection(firestore, collectionName);

  let firestoreQuery = query(dataCollection, orderBy(match, way));

  if (fieldToFilter && valueToMatch !== undefined) {
    firestoreQuery = query(
      firestoreQuery,
      where(fieldToFilter, "==", valueToMatch)
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
