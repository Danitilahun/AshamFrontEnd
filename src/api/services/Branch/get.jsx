import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../services/firebase";

const fetchData = (collectionName, setData) => {
  const dataCollection = collection(firestore, collectionName);
  return onSnapshot(dataCollection, async (querySnapshot) => {
    const newData = [];

    for (const docu of querySnapshot.docs) {
      const docData = docu?.data();
      const id = docu?.id;

      // Find the corresponding document in the Status collection
      let statusData;
      if (docData.active) {
        const statusDocRef = doc(firestore, "Status", docData.active);

        const statusDocSnapshot = await getDoc(statusDocRef);
        statusData = statusDocSnapshot.data() || {};
      }

      const budgetDocRef = doc(firestore, "Budget", id);
      const budgetDocSnapshot = await getDoc(budgetDocRef);
      const budgetData = budgetDocSnapshot.data() || {};
      // Combine the data and status data
      const combinedData = {
        id: id,
        ...docData,
        status: statusData,
        budget: budgetData,
      };

      newData.push(combinedData);
    }

    setData(newData);
  });
};

export default fetchData;
