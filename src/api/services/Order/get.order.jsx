// import {
//   collection,
//   query,
//   orderBy,
//   limit,
//   getDocs,
//   startAfter,
//   where,
// } from "firebase/firestore";
// import { firestore } from "../../../services/firebase";

// const fetchTwoDocuments = async (
//   collectionName,
//   lastDocument,
//   fieldValue,
//   fieldName
// ) => {
//   const dataCollection = collection(firestore, collectionName);

//   let fieldValueQuery = query(
//     dataCollection,
//     where(fieldName, "==", fieldValue),
//     orderBy("createdAt", "desc")
//   );

//   if (lastDocument) {
//     fieldValueQuery = query(fieldValueQuery, startAfter(lastDocument));
//   }

//   fieldValueQuery = query(fieldValueQuery, limit(2)); // Limit to two documents

//   const querySnapshot = await getDocs(fieldValueQuery);

//   const newData = querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));

//   return newData;
// };

// export default fetchTwoDocuments;

import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { firestore } from "../../../services/firebase";

const fetchTwoDocuments = async (
  collectionName,
  lastDocument,
  fieldValue,
  fieldName,
  callback // Callback function to handle updates
) => {
  const dataCollection = collection(firestore, collectionName);

  let fieldValueQuery = query(
    dataCollection,
    where(fieldName, "==", fieldValue),
    orderBy("createdAt", "desc")
  );

  if (lastDocument) {
    fieldValueQuery = query(fieldValueQuery, startAfter(lastDocument));
  }

  fieldValueQuery = query(fieldValueQuery, limit(2)); // Limit to two documents

  const unsubscribe = onSnapshot(fieldValueQuery, (querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(newData);
  });

  // Return the unsubscribe function to stop the listener when needed
  return unsubscribe;
};

export default fetchTwoDocuments;
