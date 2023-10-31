import { useEffect, useState } from "react";
import fetchData from "../api/services/Branch/get";

const useBranchData = (collectionName) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchData(collectionName, setData);

    return () => {
      unsubscribe();
    };
  }, [collectionName]);

  return { data };
};

export default useBranchData;
