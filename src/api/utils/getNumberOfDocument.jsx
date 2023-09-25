import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../services/firebase";

const getNumberOfDocumentsInCollection = async (
  collectionName,
  conditionField,
  conditionValue
) => {
  try {
    const dataCollection = collection(firestore, collectionName);
    console.log(
      "conditionField",
      conditionField,
      "conditionValue",
      conditionValue
    );
    // Create a query to filter the documents based on the condition
    const q = query(
      dataCollection,
      where(conditionField, "==", conditionValue)
    );

    // Get the documents that match the query
    const querySnapshot = await getDocs(q);

    // Retrieve the number of documents
    const numberOfDocuments = querySnapshot.size;

    return numberOfDocuments;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getNumberOfDocumentsInCollection;
