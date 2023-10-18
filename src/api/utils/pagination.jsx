import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "../../services/firebase";

const fetchFirestoreDataWithFilter = (
  collectionName,
  lastDoc,
  limitNumber,
  existingData,
  setData,
  match = "createdAt",
  way = "desc"
) => {
  const dataCollection = collection(firestore, collectionName);

  let firestoreQuery = query(dataCollection, orderBy(match, way));

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
