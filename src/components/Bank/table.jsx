import React, { useEffect, useState } from "react";
import { Box, Grid, useTheme } from "@mui/material";
import { useCallback } from "react";
import DynamicTable from "../DynamicTable/DynamicTable";
import fetchFirestoreDataWithFilter from "../../api/utils/filterBasedOnTwoCriterial";
import { useParams } from "react-router-dom";

const columns = [
  { key: "transactionType", title: "Type" },
  { key: "amount", title: "Amount" },
  { key: "date", title: "Date" },
];

const BankTable = ({ bankName }) => {
  const params = useParams();
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [lastDoc, setLastDoc] = useState(null); // To keep track of the last document

  console.log("bankName", bankName);
  const loadInitialData = async () => {
    try {
      fetchFirestoreDataWithFilter(
        "Bank",
        null,
        10,
        data,
        setData,
        "branchId",
        params.id,
        "bankName",
        bankName
      );
      // Set the last document for pagination
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setLastDoc(data[data.length - 1]);
    }
  }, [data]);

  const loadMoreData = useCallback(async () => {
    try {
      if (lastDoc) {
        fetchFirestoreDataWithFilter(
          "Bank",
          lastDoc,
          5,
          data,
          setData,
          "branchId",
          params.id,
          "bankName",
          bankName
        );

        if (data.length > 0) {
          setLastDoc(data[data.length - 1]);
        }
      }
    } catch (error) {
      console.error("Error loading more data:", error);
    }
  }, [lastDoc, data]);

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

  return (
    <Box
      m="3rem 0"
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "30vh",
        position: "relative",
      }}
    >
      <DynamicTable
        data={data}
        columns={columns}
        loadMoreData={loadMoreData}
        containerHeight={200}
      />
    </Box>
  );
};

export default BankTable;
