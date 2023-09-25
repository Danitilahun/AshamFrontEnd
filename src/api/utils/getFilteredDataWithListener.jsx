import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../../services/firebase";

const getFilteredDataWithListener = (
  collectionName,
  conditionField1,
  conditionValue1,
  conditionField2,
  conditionValue2,
  onUpdate
) => {
  const dataCollection = collection(firestore, collectionName);

  // Create a query to filter the documents based on the conditions
  const q = query(
    dataCollection,
    where(conditionField1, "==", conditionValue1),
    where(conditionField2, "==", conditionValue2)
  );

  // Set up a real-time listener
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    onUpdate(documents);
  });

  return unsubscribe;
};

export default getFilteredDataWithListener;
