import React, { useEffect, useState } from "react";
import Header from "../../components/VersatileComponents/Header";
import { Box, Grid, Typography } from "@mui/material";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import loadDataFromFirestore from "../../api/utils/loadDataFromFirestore";
import { useCallback } from "react";

import { useTheme } from "@emotion/react";
import SearchInput from "../../components/VersatileComponents/SearchInput";
import { boolean } from "yup";
import getInternationalDate from "../../utils/getDate";
import { useParams } from "react-router-dom";
import getHumanReadableDate from "../../utils/humanReadableDate";

const columns = [
  { key: "name", title: "Name" },
  { key: "phone", title: "Phone" },
  { key: "blockHouse", title: "Block House" },
  { key: "day", title: "CreatedDate" },
  { key: "lastseen", title: "Lastseen" },
  { key: "Asbeza", title: "Asbeza" },
  { key: "Card", title: "Card" },
  { key: "Water", title: "Water" },
  { key: "Wifi", title: "Wifi" },
];

const Customer = () => {
  // const [data, setData] = useState(dummyData);
  const params = useParams();
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [lastDoc, setLastDoc] = useState(null); // To keep track of the last document

  useEffect(() => {
    // Function to load initial data
    const loadInitialData = async () => {
      try {
        loadDataFromFirestore(
          "customer",
          null,
          8,
          data,
          setData,
          "branchId",
          params.id
        );
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
    console.log("Loading more data...");
    console.log("lastDoc", lastDoc);
    console.log("data", data);
    try {
      console.log("lastDoc", lastDoc);
      if (lastDoc) {
        loadDataFromFirestore(
          "customer",
          lastDoc,
          5,
          data,
          setData,
          "branchId",
          params.id
        );
        // Set the last document for pagination
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
      m="1.5rem 2.5rem"
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100%",
        position: "relative",
      }}
    >
      <Grid container spacing={2}>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <Box flex="1">
            <Typography
              variant="h2"
              color={theme.palette.secondary[100]}
              fontWeight="bold"
              sx={{ mb: "5px" }}
            >
              Customer
            </Typography>

            <Typography variant="h5" color={theme.palette.secondary[300]}>
              Entire list of Customers
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SearchInput onSearch={handleSearch} onCancel={handleCancel} />
        </Grid>
      </Grid>
      {/* <Header title="Customer" subtitle="Entire list of Customers" /> */}
      {/* <SearchInput onSearch={handleSearch} onCancel={handleCancel} /> */}
      <DynamicTable data={data} columns={columns} loadMoreData={loadMoreData} />
    </Box>
  );
};

export default Customer;
