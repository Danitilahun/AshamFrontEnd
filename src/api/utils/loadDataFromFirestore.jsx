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

const loadDataFromFirestore = (
  collectionName,
  lastDoc,
  limitNumber,
  existingData,
  setData,
  fieldToFilter = "null",
  valueToMatch = "null"
) => {
  console.log("-----------start after", fieldToFilter, valueToMatch);
  const dataCollection = collection(firestore, collectionName);
  let firestoreQuery;
  if (fieldToFilter === "null") {
    firestoreQuery = query(dataCollection, orderBy("createdAt", "desc"));
  } else {
    console.log("herereere");
    firestoreQuery = query(
      dataCollection,
      where(fieldToFilter, "==", valueToMatch), // Add the filter condition here
      orderBy("createdAt", "desc")
    );
  }

  if (lastDoc) {
    firestoreQuery = query(
      dataCollection,
      orderBy("createdAt", "desc"),
      startAfter(lastDoc.createdAt)
    );
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

export default loadDataFromFirestore;
