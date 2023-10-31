import { useParams } from "react-router-dom";
import DynamicTable from "../DynamicTable/DynamicTable";
import { useState } from "react";
import useDocumentById from "../../hooks/useDocumentById";
import { Box } from "@mui/material";
import { firestore } from "../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useCallback } from "react";

const columns = [
  { key: "no", title: "No" },
  { key: "name", title: "Name" },
  { key: "amount", title: "Amount" },
];

const NewExpenseTable = ({ id }) => {
  console.log(id);
  const [statusData, setStatusData] = useState({});
  let statusDataArray = [];
  useEffect(() => {
    if (!id) {
      return; // Add a check for branchId
    }
    const worksRef = doc(collection(firestore, "Status"), id);
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(worksRef, (doc) => {
      if (doc.exists()) {
        setStatusData({
          ...doc.data(),
        });
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [id]);

  console.log("testing status ", statusData);
  const excludeProperties = [
    "houseRentOwnerName",
    "wifiAccount",
    "wifiOwnerName",
    "houseRentAccount",
    "houseRentOwnerName",
    "ethioTelAccount",
    "ethioTelOwnerName",
    "taxPersentage",
    "date",
    "createdDate",
    "branchId",
  ]; // Add the properties you want to exclude here

  // Define the desired order of keys (ExpenseName)
  const orderOfKeys = [
    "wifi",
    "houseRent",
    "totaltax",
    "ethioTelBill",
    "totalStaffSalary",
    "totalDeliveryGuySalary",
    "totalIncome",
    "totalExpense",
  ];

  if (statusData) {
    // Find properties that are not in excludeProperties or orderOfKeys
    const additionalProperties = Object.keys(statusData).filter(
      (key) => !excludeProperties.includes(key) && !orderOfKeys.includes(key)
    );

    // Combine additionalProperties and ordered properties
    statusDataArray = [
      ...additionalProperties.map((key, index) => ({
        no: index + 1,
        name: key,
        amount: statusData[key],
      })),
      ...orderOfKeys
        .filter((key) => !excludeProperties.includes(key))
        .map((key, index) => ({
          no: index + additionalProperties.length + 1,
          name: key,
          amount: statusData[key],
        })),
    ];
    console.log("statusDataArray", statusDataArray);
  }

  const loadMoreData = useCallback(async () => {
    return null;
  }, []);
  useEffect(() => {
    const handleDynamicTableScroll = (event) => {
      const scrollPosition = event.detail.scrollPosition;
      console.log("DynamicTable Scroll position:", scrollPosition);
    };

    window.addEventListener("dynamicTableScroll", handleDynamicTableScroll);

    return () => {
      window.removeEventListener(
        "dynamicTableScroll",
        handleDynamicTableScroll
      );
    };
  }, []);

  console.log("statusDataArray", statusDataArray, statusData);
  return (
    <Box m="1rem 0">
      <DynamicTable
        data={Object.keys(statusData).length !== 0 ? statusDataArray : []}
        columns={columns}
        loadMoreData={loadMoreData}
        containerHeight={480}
      />
    </Box>
  );
};

export default NewExpenseTable;
