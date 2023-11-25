import { useEffect, useState } from "react";
import fetchData from "../api/services/Users/getUser";

const useExportData = (collectionName, key) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!key) {
      return;
    }

    const unsubscribe = fetchData(collectionName, setData);

    return () => {
      unsubscribe();
    };
  }, [collectionName]);

  // Define an array of fields to exclude
  const fieldsToExclude = [
    "id",
    "activeTable",
    "active",
    "callcenterId",
    "deliveryguyId",
    "activeDailySummery",
    "order",
    "status",
  ];

  // Filter out the excluded fields from the data
  const filteredData = data.map((item) => {
    // Create a new object with only the desired fields
    const filteredItem = Object.keys(item)
      .filter((key) => !fieldsToExclude.includes(key))
      .reduce((obj, key) => {
        obj[key] = item[key];
        return obj;
      }, {});
    return filteredItem;
  });

  return { data: filteredData };
};

export default useExportData;
