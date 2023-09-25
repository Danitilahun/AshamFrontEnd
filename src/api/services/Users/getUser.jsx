import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../../../services/firebase";

const fetchData = (collectionName, setData) => {
  const dataCollection = collection(firestore, collectionName);
  return onSnapshot(dataCollection, (querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (
      collectionName === "prices" ||
      collectionName === "companyGain" ||
      collectionName === "Deliveryturn" ||
      collectionName === "dashboard" ||
      collectionName === "branchInfo" ||
      collectionName === "ashamStaff"
    ) {
      setData(newData[0]);
    } else {
      setData(newData);
    }
  });
};

export default fetchData;
