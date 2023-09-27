import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import SearchInput from "../../VersatileComponents/SearchInput";
import DynamicTable from "../../DynamicTable/DynamicTable";
import deleteCredit from "../../../api/credit/delete";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import LoadingSpinner from "../../VersatileComponents/LoadingSpinner";
import ConfirmationDialog from "../../VersatileComponents/ConfirmationDialog";
import MyHeaderComponent from "../../VersatileComponents/MyHeaderComponent";
import HotelProfitReportForm from "../createReportForm/hospitalProfit";
import getRequiredUserData from "../../../utils/getBranchInfo";
import fetchFirestoreDataWithFilter from "../../../api/utils/filterBasedOnTwoCriterial";
import Search from "../../../api/utils/searchMore";

const columns = [
  { key: "deliveryguyName", title: "Delivery Guy Name" },
  { key: "amount", title: "Amount" },
  { key: "date", title: "Date" },
  { key: "time", title: "Time" },
];

const HotelProfitTable = () => {
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
        "hotelProfit",
        null,
        8,
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
      Search(
        "hotelProfit",
        null,
        1000,
        searchedData,
        setSearchedData,
        "branchId",
        params.id,
        "deliveryguyName",
        searchText,
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
          "hotelProfit",
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
        title="Hotel profit Report"
        subtitle="Entire list of Hotel profit report"
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={HotelProfitReportForm}
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

export default HotelProfitTable;
