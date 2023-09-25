// organizeData.js

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

  const getDeliveryGuyData = async (deliveryGuyId) => {
    const deliveryGuyRef = doc(
      collection(firestore, "deliveryguy"),
      deliveryGuyId
    );
    const deliveryGuySnapshot = await getDoc(deliveryGuyRef);
    return deliveryGuySnapshot.exists() ? deliveryGuySnapshot.data() : null;
  };

  const getDeliveryGuySalary = async () => {
    const collectionRef = collection(firestore, "prices");
    const querySnapshot = await getDocs(collectionRef);

    if (!querySnapshot.empty) {
      const firstDoc = querySnapshot.docs[0];
      return firstDoc.data();
    } else {
      return null; // Collection is empty
    }
  };

  const updateFinalData = async (tableData) => {
    console.log(tableData);
    const finalData = [];
    const arrayToSkip = [
      "date",
      "branchId",
      "sheetId",
      "activeDailySummery",
      "active",
    ];
    // if (collectionName === "salary") {
    //   const salary = await getDeliveryGuySalary();
    //   const fixedSalary = parseInt(salary["fixedSalary"]);

    //   for (const [key, value] of Object.entries(tableData)) {
    //     if (arrayToSkip.includes(key)) {
    //       continue;
    //     }
    //     value.id = key;
    //     if (key != "total") {
    //       value.fixedSalary = fixedSalary;
    //       value.total = value.total + fixedSalary;
    //       tableData["total"].fixedSalary =
    //         tableData["total"].fixedSalary + fixedSalary;
    //       tableData["total"].total = tableData["total"].total + fixedSalary;
    //     }
    //     finalData.push(value);
    //   }
    // } else {
    for (const [key, value] of Object.entries(tableData)) {
      if (arrayToSkip.includes(key)) {
        continue;
      }
      value["id"] = key;
      finalData.push(value);
    }
    // }
    const sortedData = Object.values(finalData).sort(
      (a, b) => b.total - a.total
    );
    console.log("sorted", sortedData);
    const totalIndex = sortedData.findIndex((item) => item.name == "total");
    if (totalIndex !== -1) {
      const totalItem = sortedData.splice(totalIndex, 1)[0];
      console.log("total item", totalItem);
      sortedData.push(totalItem);
    }
    console.log("index", totalIndex);
    console.log("sorted", sortedData);
    // console.log("sorted data", sortedData);
    return sortedData;
  };

  // Set up real-time update listeners for "tables", "deliveryguy", and "works" collections
  const unsubscribeTable = onSnapshot(tableRef, async (docSnap) => {
    if (docSnap.exists()) {
      const tableData = docSnap.data();
      const finalData = await updateFinalData(tableData);
      onDataChanged(finalData);
    } else {
      console.log("Table not found with ID:", tableId);
      onDataChanged([]);
    }
  });

  // Set up real-time update listener for "deliveryguy" collection
  const deliveryGuyCollectionRef = collection(firestore, "deliveryguy");
  const unsubscribeDeliveryGuy = onSnapshot(
    deliveryGuyCollectionRef,
    async (querySnapshot) => {
      // Fetch tableData again, since it might have changed
      const tableSnapshot = await getDoc(tableRef);
      if (tableSnapshot.exists()) {
        const tableData = tableSnapshot.data();
        const finalData = await updateFinalData(tableData);
        onDataChanged(finalData);
      } else {
        console.log("Table not found with ID:", tableId);
        onDataChanged([]);
      }
    }
  );

  const deliveryGuyCollectionRefPrice = collection(firestore, "prices");
  const unsubscribeDeliveryGuyPrice = onSnapshot(
    deliveryGuyCollectionRefPrice,
    async (querySnapshot) => {
      // Fetch tableData again, since it might have changed
      const tableSnapshot = await getDoc(tableRef);
      if (tableSnapshot.exists()) {
        const tableData = tableSnapshot.data();
        const finalData = await updateFinalData(tableData);
        onDataChanged(finalData);
      } else {
        console.log("Table not found with ID:", tableId);
        onDataChanged([]);
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
