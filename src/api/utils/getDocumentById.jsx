// getDocumentById.js

import { collection, doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../../services/firebase";

// Reusable function to get a document by ID from a specific collection
const getDocumentById = async (collectionName, id, onDataChanged) => {
  const collectionRef = collection(firestore, collectionName);
  const docRef = doc(collectionRef, id);

  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      onDataChanged(data);
    } else {
      onDataChanged(null);
    }
  });

  // Return the unsubscribe function to stop listening to updates
  return unsubscribe;
};

export default getDocumentById;
