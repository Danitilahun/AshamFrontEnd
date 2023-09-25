import { useEffect, useState } from "react";
import getData from "../api/services/DeliveryGuy/getDeliveryGuy";

const useFilteredCollectionData = (collectionName, condition, value) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (value) {
      const unsubscribe = getData(collectionName, condition, value, (data) => {
        setData(data);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [collectionName, condition, value]);

  return { data };
};

export default useFilteredCollectionData;
