import { useState, useEffect } from "react";
import { doc, collection, onSnapshot } from "firebase/firestore"; // Import Firestore as needed
import { firestore } from "../services/firebase";

const useTableDate = (sheetId) => {
  const [tableDate, setTableDate] = useState([]);

  useEffect(() => {
    const worksRef = doc(collection(firestore, "sheets"), sheetId);

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(worksRef, (doc) => {
      if (doc.exists()) {
        setTableDate(doc.data().tableDate);
      } else {
        setTableDate([]);
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [firestore, sheetId]);

  return tableDate;
};

export default useTableDate;
