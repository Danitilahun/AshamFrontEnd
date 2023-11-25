import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "../../../services/firebase";

const organizeData = (tableId, onDataChanged, collectionName) => {
  const tableRef = doc(collection(firestore, collectionName), tableId);

  const updateFinalData = async (tableData) => {
    const finalData = [];
    const arrayToSkip = [
      "date",
      "branchId",
      "sheetId",
      "activeDailySummery",
      "active",
    ];

    for (const [key, value] of Object.entries(tableData)) {
      if (arrayToSkip.includes(key)) {
        continue;
      }
      value["id"] = key;
      finalData.push(value);
    }

    let sortedData = Object.values(finalData).sort((a, b) => b.total - a.total);
    sortedData = sortedData.map((obj) => {
      obj.total -= obj.totalCredit || 0;
      return obj;
    });

    const totalIndex = sortedData.findIndex((item) => item.name == "total");
    if (totalIndex !== -1) {
      const totalItem = sortedData.splice(totalIndex, 1)[0];

      sortedData.push(totalItem);
    }

    return sortedData;
  };

  // Set up real-time update listeners for "tables", "deliveryguy", and "works" collections
  const unsubscribeTable = onSnapshot(tableRef, async (docSnap) => {
    try {
      if (docSnap.exists()) {
        const tableData = docSnap.data();
        const finalData = await updateFinalData(tableData);
        onDataChanged(finalData);
      } else {
        onDataChanged([]);
      }
    } catch (error) {
      // Handle the error gracefully, e.g., display an error message to the user
      // or log it for debugging.
    }
  });

  // Set up real-time update listener for "deliveryguy" collection
  const deliveryGuyCollectionRef = collection(firestore, "deliveryguy");
  const unsubscribeDeliveryGuy = onSnapshot(
    deliveryGuyCollectionRef,
    async (querySnapshot) => {
      try {
        // Fetch tableData again, since it might have changed
        const tableSnapshot = await getDoc(tableRef);
        if (tableSnapshot.exists()) {
          const tableData = tableSnapshot.data();
          const finalData = await updateFinalData(tableData);
          onDataChanged(finalData);
        } else {
          onDataChanged([]);
        }
      } catch (error) {
        // Handle the error gracefully, e.g., display an error message to the user
        // or log it for debugging.
      }
    }
  );

  const deliveryGuyCollectionRefPrice = collection(firestore, "prices");
  const unsubscribeDeliveryGuyPrice = onSnapshot(
    deliveryGuyCollectionRefPrice,
    async (querySnapshot) => {
      try {
        // Fetch tableData again, since it might have changed
        const tableSnapshot = await getDoc(tableRef);
        if (tableSnapshot.exists()) {
          const tableData = tableSnapshot.data();
          const finalData = await updateFinalData(tableData);
          onDataChanged(finalData);
        } else {
          onDataChanged([]);
        }
      } catch (error) {
        // Handle the error gracefully, e.g., display an error message to the user
        // or log it for debugging.
      }
    }
  );

  // Return the unsubscribe functions to stop listening to updates
  return () => {
    unsubscribeTable();
    unsubscribeDeliveryGuy();
    unsubscribeDeliveryGuyPrice();
  };
};

export default organizeData;
