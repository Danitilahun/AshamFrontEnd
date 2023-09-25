// useTableData.js - Custom Hook for Firestore Table Data
import { useState, useEffect } from "react";
import organizeData from "../api/services/Table/get.table";

const useTableData = (id, from = "tables") => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Function to handle real-time updates and clean up listeners
    const handleRealTimeUpdates = (data) => {
      setData(data);
    };

    // Set up real-time update listeners and fetch initial data
    const unsubscribe = organizeData(id, handleRealTimeUpdates, from);

    // Clean up the listeners when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [id]);

  return { data };
};

export default useTableData;
