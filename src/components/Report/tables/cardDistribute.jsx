import React, { useContext, useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import SearchInput from "../../VersatileComponents/SearchInput";
import DynamicTable from "../../DynamicTable/DynamicTable";
import deleteCredit from "../../../api/credit/delete";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import CardDistributeReportForm from "../createReportForm/cardDistribute";
import MyHeaderComponent from "../../VersatileComponents/MyHeaderComponent";
import fetchFirestoreDataWithFilter from "../../../api/utils/filterBasedOnTwoCriterial";
import getRequiredUserData from "../../../utils/getBranchInfo";
import Search from "../../../api/utils/searchMore";
//import { SpinnerContext } from "../../../contexts/SpinnerContext";
import capitalizeString from "../../../utils/capitalizeString";

const columns = [
  { key: "deliveryguyName", title: "Delivery Guy Name" },
  { key: "numberOfCard", title: "Number Of Card" },
  { key: "gain", title: "Gain" },
  { key: "amount", title: "Expense" },
  { key: "total", title: "Total" },
  { key: "date", title: "Date" },
  { key: "time", title: "Time" },
];

const CardDistributeTable = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const { user } = useAuth();
  const theme = useTheme();
  const [lastDoc, setLastDoc] = useState(null); // To keep track of the last document
  const [searchedData, setSearchedData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  //   const [deleteRowId, setDeleteRowId] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { openSnackbar } = useSnackbar();
  const branchData = getRequiredUserData();

  const handleEdit = (row) => {
    console.log("from the table", row);
    setEditRow(row);
    setIsEditDialogOpen(true);
  };

  const loadInitialData = async () => {
    try {
      fetchFirestoreDataWithFilter(
        "cardDistribute",
        null,
        10,
        data,
        setData,
        "branchId",
        params.id,
        "active",
        branchData.active
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
      const searchTextNew = capitalizeString(searchText);
      Search(
        "cardDistribute",
        null,
        1000,
        searchedData,
        setSearchedData,
        "branchId",
        params.id,
        "active",
        branchData.active,
        "deliveryguyName",
        searchTextNew
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
          "cardDistribute",
          lastDoc,
          5,
          data,
          setData,
          "branchId",
          params.id,
          "active",
          branchData.active
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

  const tableData = searchedData.length > 0 ? searchedData : data;
  return (
    <Box m="1rem 0">
      <MyHeaderComponent
        title="Card Distribute Report"
        subtitle="Entire list of Card Distribute Reports"
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={CardDistributeReportForm}
      />
      {/* <Grid container spacing={2}> */}
      {/* <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
              Card Distribute Report
            </Typography>

            <Typography variant="h5" color={theme.palette.secondary[300]}>
              Entire list of Card Distribute Reports
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={5}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SearchInput onSearch={handleSearch} onCancel={handleCancel} />
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <CardDistributeReportForm />
        </Grid>
      </Grid> */}

      <DynamicTable
        data={tableData}
        columns={columns}
        loadMoreData={loadMoreData}
        onEdit={handleEdit}
        // onDelete={handleDelete}
      />
    </Box>
  );
};

export default CardDistributeTable;

// import * as React from 'react';
// import {
//   DataGridPremium,
//   GridToolbarContainer,
//   GridToolbarExport,
//   GridColDef,
//   GridRowsProp,
// } from '@mui/x-data-grid-premium';

// const rows: GridRowsProp = [
//   {
//     jobTitle: 'Head of Human Resources',
//     recruitmentDate: new Date(2020, 8, 12),
//     contract: 'full time',
//     id: 0,
//   },
//   {
//     jobTitle: 'Head of Sales',
//     recruitmentDate: new Date(2017, 3, 4),
//     contract: 'full time',
//     id: 1,
//   },
//   {
//     jobTitle: 'Sales Person',
//     recruitmentDate: new Date(2020, 11, 20),
//     contract: 'full time',
//     id: 2,
//   },
//   {
//     jobTitle: 'Sales Person',
//     recruitmentDate: new Date(2020, 10, 14),
//     contract: 'part time',
//     id: 3,
//   },
//   {
//     jobTitle: 'Sales Person',
//     recruitmentDate: new Date(2017, 10, 29),
//     contract: 'part time',
//     id: 4,
//   },
//   {
//     jobTitle: 'Sales Person',
//     recruitmentDate: new Date(2020, 7, 21),
//     contract: 'full time',
//     id: 5,
//   },
//   {
//     jobTitle: 'Sales Person',
//     recruitmentDate: new Date(2020, 7, 20),
//     contract: 'intern',
//     id: 6,
//   },
//   {
//     jobTitle: 'Sales Person',
//     recruitmentDate: new Date(2019, 6, 28),
//     contract: 'full time',
//     id: 7,
//   },
//   {
//     jobTitle: 'Head of Engineering',
//     recruitmentDate: new Date(2016, 3, 14),
//     contract: 'full time',
//     id: 8,
//   },
//   {
//     jobTitle: 'Tech lead front',
//     recruitmentDate: new Date(2016, 5, 17),
//     contract: 'full time',
//     id: 9,
//   },
//   {
//     jobTitle: 'Front-end developer',
//     recruitmentDate: new Date(2019, 11, 7),
//     contract: 'full time',
//     id: 10,
//   },
//   {
//     jobTitle: 'Tech lead devops',
//     recruitmentDate: new Date(2021, 7, 1),
//     contract: 'full time',
//     id: 11,
//   },
//   {
//     jobTitle: 'Tech lead back',
//     recruitmentDate: new Date(2017, 0, 12),
//     contract: 'full time',
//     id: 12,
//   },
//   {
//     jobTitle: 'Back-end developer',
//     recruitmentDate: new Date(2019, 2, 22),
//     contract: 'intern',
//     id: 13,
//   },
//   {
//     jobTitle: 'Back-end developer',
//     recruitmentDate: new Date(2018, 4, 19),
//     contract: 'part time',
//     id: 14,
//   },
// ];

// const columns: GridColDef[] = [
//   { field: 'jobTitle', headerName: 'Job Title', width: 200 },
//   {
//     field: 'recruitmentDate',
//     headerName: 'Recruitment Date',
//     type: 'date',
//     width: 150,
//   },
//   {
//     field: 'contract',
//     headerName: 'Contract Type',
//     type: 'singleSelect',
//     valueOptions: ['full time', 'part time', 'intern'],
//     width: 150,
//   },
// ];

// function CustomToolbar() {
//   return (
//     <GridToolbarContainer>
//       <GridToolbarExport />
//     </GridToolbarContainer>
//   );
// }

// export default function ExcelExport() {
//   return (
//     <div style={{ height: 300, width: '100%' }}>
//       <DataGridPremium
//         rows={rows}
//         columns={columns}
//         slots={{
//           toolbar: CustomToolbar,
//         }}
//       />
//     </div>
//   );
// }
