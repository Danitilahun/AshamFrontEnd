import React, { useEffect, useState } from "react";
import Header from "../../components/VersatileComponents/Header";
import { Box, Grid } from "@mui/material";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import loadDataFromFirestore from "../../api/utils/loadDataFromFirestore";
import { useCallback } from "react";
import { useTheme } from "@emotion/react";
import SearchInput from "../../components/VersatileComponents/SearchInput";
import getHumanReadableDate from "../../utils/humanReadableDate";

const columns = [
  { key: "name", title: "Name" },
  { key: "phone", title: "Phone" },
  { key: "blockHouse", title: "Block House" },
  { key: "branchName", title: "Branch Name" },
  { key: "day", title: "CreatedDate" },
  { key: "lastseen", title: "Lastseen" },
  { key: "Asbeza", title: "Asbeza" },
  { key: "Card", title: "Card" },
  { key: "Water", title: "Water" },
  { key: "Wifi", title: "Wifi" },
];

const Customer = () => {
  // const [data, setData] = useState(dummyData);
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [lastDoc, setLastDoc] = useState(null); // To keep track of the last document

  useEffect(() => {
    // Function to load initial data
    const loadInitialData = async () => {
      try {
        await loadDataFromFirestore("customer", null, 8, data, setData);
        // Set the last document for pagination
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    // Load initial data when the component mounts
    loadInitialData();
  }, []);

  function processArrayOfObjects(data) {
    const currentDate = new Date();

    return data.map((item) => {
      // Convert properties
      console.log("check", Boolean(item.Asbeza) === true);
      // Calculate day difference

      const createdDate = new Date(item.createdDate);
      const dayDifference = Math.floor(
        (currentDate - createdDate) / (1000 * 60 * 60 * 24)
      );
      item.lastseen = dayDifference;
      item.day = getHumanReadableDate(item.createdDate);
      return item;
    });
  }
  const processedData = processArrayOfObjects(data);

  console.log("data", processedData);

  useEffect(() => {
    if (data.length > 0) {
      setLastDoc(data[data.length - 1]);
    }
  }, [data]);

  const handleSearch = (searchText) => {
    console.log("Search Text:", searchText);

    // Perform additional actions when searching here

    if (searchText.trim() === "") {
      // Perform actions when the search input is empty
    }

    // Perform the actual search logic here and update the data accordingly
    // For now, let's just clear the search input
  };

  const handleCancel = () => {
    // Perform actions when the cancel button is clicked
  };

  const loadMoreData = useCallback(async () => {
    try {
      if (lastDoc) {
        loadDataFromFirestore("Asbeza", lastDoc, 5, data, setData);

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
    <Box m="1.5rem 2.5rem">
      <Header title="Customer" subtitle="Entire list of Customers" />
      <SearchInput onSearch={handleSearch} onCancel={handleCancel} />
      <DynamicTable
        data={processedData}
        columns={columns}
        loadMoreData={loadMoreData}
      />
    </Box>
  );
};

export default Customer;
