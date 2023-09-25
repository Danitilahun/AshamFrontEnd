import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../../services/firebase";

const getDataFromCollectionWithCriteria = (
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
    const firstDocumentData = querySnapshot.docs[0]?.data() || null;
    onUpdate(firstDocumentData);
  });

  return unsubscribe;
};

export default getDataFromCollectionWithCriteria;
