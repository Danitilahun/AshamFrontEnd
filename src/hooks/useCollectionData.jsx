import { useEffect, useState } from "react";
import fetchData from "../api/services/Users/getUser";

const useCollectionData = (collectionName) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchData(collectionName, setData);

    return () => {
      unsubscribe();
    };
  }, [collectionName]);

  return { data };
};

export default useCollectionData;
