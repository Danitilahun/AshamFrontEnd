import React, { useEffect, useState } from "react";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import fetchFirestoreDataWithFilter from "../../../api/credit/get";
import Search from "../../../api/utils/search";
import SearchInput from "../../VersatileComponents/SearchInput";
import LoadingSpinner from "../../VersatileComponents/LoadingSpinner";
import DynamicTable from "../../DynamicTable/DynamicTable";
import ConfirmationDialog from "../../VersatileComponents/ConfirmationDialog";
import EditWaterOrderForm from "../EditForm/branchForm";
import Delete from "../../../api/orders/delete";

const CallcenterColumn = [
  { key: "name", title: "Customer Name" },
  { key: "phone", title: "Phone" },
  { key: "blockHouse", title: "Block House" },
  { key: "billPayerName", title: "Bill Payer Name" },
  { key: "customerKey", title: "Customer Key" },
  { key: "deliveryguyName", title: "Delivery Guy Name" },
  { key: "status", title: "Status" }, // Added "Status" column
];
const columns = [
  ...CallcenterColumn,
  { key: "edit", title: "Edit" },
  { key: "delete", title: "Delete" },
  { key: "new", title: "New" }, // Added "New" column
];

const WaterTable = () => {
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("callcenter");

  // Function to handle view selection (Call Center or Branch)
  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const handleEdit = (row) => {
    console.log("from the table", row);
    setEditRow(row);
    setIsEditDialogOpen(true);
  };
  const handleNew = (row) => {
    console.log("from the table", row);
    setEditRow(row);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id) => {
    openDeleteConfirmationDialog(id);
  };

  const handleDeleteConfirmed = async () => {
    setIsSubmitting(true);
    closeDeleteConfirmationDialog();
    try {
      // Attempt to delete the credit document
      const res = await Delete(user, deleteItemId, "water");
      openSnackbar(`${res.data.message}!`, "success");
    } catch (error) {
      console.error("Error deleting credit document:", error);
      openSnackbar(
        error.response.data.message,
        error.response.data.type ? error.response.data.type : "error"
      );
    }

    setIsSubmitting(false);
    setDeleteItemId(null);
  };

  const openDeleteConfirmationDialog = (id) => {
    setDeleteItemId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteConfirmationDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const loadInitialData = async () => {
    try {
      const filterField =
        selectedView === "callcenter" ? "branchId" : "callcenterId";
      console.log("filterField", filterField);
      fetchFirestoreDataWithFilter(
        "Water",
        null,
        8,
        data,
        setData,
        filterField,
        params.id
      );
      // Set the last document for pagination
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [selectedView]);

  useEffect(() => {
    if (data.length > 0) {
      setLastDoc(data[data.length - 1]);
    }
  }, [data]);

  const handleSearch = async (searchText) => {
    if (searchText.trim() === "") {
      setSearchedData([]);
      loadInitialData();
      // Perform actions when the search input is empty
    } else {
      const filterField =
        selectedView === "callcenter" ? "branchId" : "callcenterId";
      Search(
        "Water",
        null,
        1000,
        searchedData,
        setSearchedData,
        filterField,
        params.id,
        "blockHouse",
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
        const filterField =
          selectedView === "callcenter" ? "branchId" : "callcenterId";
        fetchFirestoreDataWithFilter(
          "Water",
          lastDoc,
          5,
          data,
          setData,
          filterField,
          params.id
        );

        if (data.length > 0) {
          setLastDoc(data[data.length - 1]);
        }
      }
    } catch (error) {
      console.error("Error loading more data:", error);
    }
  }, [lastDoc, data, selectedView]);

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
      <Tabs
        value={selectedView}
        onChange={(e, newValue) => handleViewChange(newValue)}
        indicatorColor="secondary"
        textColor="secondary"
      >
        <Tab label="Call Center" value="callcenter" />
        <Tab label="Branch" value="branch" />
      </Tabs>

      <SearchInput onSearch={handleSearch} onCancel={handleCancel} />
      <LoadingSpinner isSubmitting={isSubmitting} />
      <DynamicTable
        data={tableData}
        columns={selectedView === "callcenter" ? CallcenterColumn : columns}
        loadMoreData={loadMoreData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onNew={handleNew}
        orderType="water"
      />
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        handleDialogClose={closeDeleteConfirmationDialog}
        handleConfirmed={handleDeleteConfirmed}
        message="Are you sure you want to delete this item?"
        title="Delete Confirmation"
      />
      {isEditDialogOpen && (
        <EditWaterOrderForm
          data={editRow}
          isEditDialogOpen={isEditDialogOpen}
          closeEditDialog={() => setIsEditDialogOpen(false)}
        />
      )}
    </Box>
  );
};

export default WaterTable;
