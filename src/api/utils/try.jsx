import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../../services/firebase";

const getDocumentById = (collectionName, documentId, setData) => {
  const documentRef = doc(firestore, collectionName, documentId);

  const unsubscribe = onSnapshot(documentRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const documentData = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };
      setData(documentData);
    } else {
      // Document doesn't exist, handle accordingly
      setData(null);
    }
  });

  console.log("Unsubscribe function:", unsubscribe);

  return unsubscribe;
};

export default getDocumentById;
