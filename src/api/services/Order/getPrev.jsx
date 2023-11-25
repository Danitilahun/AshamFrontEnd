import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAt,
  where,
} from "firebase/firestore";
import { firestore } from "../../../services/firebase";

const fetchTwoDocumentsPrev = async (
  collectionName,
  lastDocument,
  fieldValue,
  fieldName
) => {
  const dataCollection = collection(firestore, collectionName);

  let fieldValueQuery = query(
    dataCollection,
    where(fieldName, "==", fieldValue),
    orderBy("createdAt", "desc")
  );

  if (lastDocument) {
    fieldValueQuery = query(fieldValueQuery, startAt(lastDocument.createdAt));
  }

  fieldValueQuery = query(fieldValueQuery, limit(2)); // Limit to two documents

  const querySnapshot = await getDocs(fieldValueQuery);

  const newData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return newData;
};

export default fetchTwoDocumentsPrev;
