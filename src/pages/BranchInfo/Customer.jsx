import React, { useEffect, useState } from "react";
import Header from "../../components/VersatileComponents/Header";
import { Box, Grid, Typography } from "@mui/material";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import { useCallback } from "react";
import { useTheme } from "@emotion/react";
import SearchInput from "../../components/VersatileComponents/SearchInput";
import { useParams } from "react-router-dom";
import getHumanReadableDate from "../../utils/humanReadableDate";
import fetchFirestoreDataWithFilter from "../../api/utils/fetchFirestoreDataWithFilter";
import Search from "../../api/utils/oneConditionSearch";

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
  const [searchedData, setSearchedData] = useState([]);

  const loadInitialData = async () => {
    try {
      await fetchFirestoreDataWithFilter(
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

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setLastDoc(data[data.length - 1]);
    }
  }, [data]);

  const handleSearch = async (searchText) => {
    console.log("Search Text:", searchText, searchText === "");

    // Perform additional actions when searching here

    if (searchText.trim() === "") {
      setSearchedData([]);
      loadInitialData();
      // Perform actions when the search input is empty
    } else {
      Search(
        "customer",
        null,
        1000,
        searchedData,
        setSearchedData,
        "branchId",
        params.id,
        "name",
        searchText
      );
    }
  };

  const handleCancel = () => {
    setSearchedData([]);
    loadInitialData();
  };

  const loadMoreData = useCallback(async () => {
    try {
      if (lastDoc) {
        fetchFirestoreDataWithFilter(
          "customer",
          lastDoc,
          5,
          data,
          setData,
          "branchId",
          params.id
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

  function processArrayOfObjects(data) {
    const currentDate = new Date();

    return data?.map((item) => {
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
  const searchResult = processArrayOfObjects(searchedData);
  console.log("data", processedData);

  const tableData = searchedData.length > 0 ? searchResult : processedData;

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
      <DynamicTable
        data={tableData}
        columns={columns}
        loadMoreData={loadMoreData}
      />
    </Box>
  );
};

export default Customer;
