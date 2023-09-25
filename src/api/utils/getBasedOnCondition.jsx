import { collection, onSnapshot, where } from "firebase/firestore";
import { firestore } from "../../services/firebase";

const fetchData = (collectionName, field, value, setData) => {
  const dataCollection = collection(firestore, collectionName);

  // Create a query with a where condition
  const query = value
    ? where(field, "==", value) // Filter if value is provided
    : dataCollection; // No filter if value is not provided

  return onSnapshot(query, (querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setData(newData);
  });
};

export default fetchData;
