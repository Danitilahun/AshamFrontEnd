import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { firestore } from "../../../services/firebase";

const getData = (
  collectionName,
  field,
  value,
  setData,
  field2 = "null",
  value2 = "null"
) => {
  const dataCollection = collection(firestore, collectionName);
  let fieldValueQuery;
  if (collectionName === "Status") {
    fieldValueQuery = query(dataCollection, where(field, "==", value));
  } else if (field2 === "null") {
    fieldValueQuery = query(
      dataCollection,
      where(field, "==", value),
      orderBy("createdAt", "desc")
    );
  } else {
    fieldValueQuery = query(
      dataCollection,
      where(field, "==", value),
      where(field2, "==", value2),
      orderBy("createdAt", "desc")
    );
  }

  return onSnapshot(fieldValueQuery, (querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (collectionName === "Calculator") {
      setData(newData[0]);
    } else {
      setData(newData);
    }
  });
};

export default getData;
