import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import DynamicTable from "../../DynamicTable/DynamicTable";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import WifiDistributeReportForm from "../createReportForm/wifiDistribute";
import MyHeaderComponent from "../../VersatileComponents/MyHeaderComponent";
import getRequiredUserData from "../../../utils/getBranchInfo";
import fetchFirestoreDataWithFilter from "../../../api/utils/filterBasedOnTwoCriterial";
import Search from "../../../api/utils/searchMore";
import capitalizeString from "../../../utils/capitalizeString";

const columns = [
  { key: "deliveryguyName", title: "Delivery Guy Name" },
  { key: "numberOfCard", title: "Number Of Card" },
  { key: "amount", title: "Amount" },
  { key: "date", title: "Date" },
  { key: "time", title: "Time" },
];

const WifiDistributeTable = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const { user } = useAuth();
  const [lastDoc, setLastDoc] = useState(null); // To keep track of the last document
  const [searchedData, setSearchedData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        "wifiDistribute",
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
    // console.log("Search Text:", searchText, searchText === "");

    // Perform additional actions when searching here

    if (searchText.trim() === "") {
      setSearchedData([]);
      loadInitialData();
      // Perform actions when the search input is empty
    } else {
      const searchTextNew = capitalizeString(searchText);
      Search(
        "wifiDistribute",
        null,
        1000,
        searchedData,
        setSearchedData,
        "branchId",
        params.id,
        "deliveryguyName",
        searchTextNew,
        "active",
        branchData.active
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
          "wifiDistribute",
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
        title="Wifi Report"
        subtitle="Entire list of wifi Reports"
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={WifiDistributeReportForm}
      />
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

export default WifiDistributeTable;
