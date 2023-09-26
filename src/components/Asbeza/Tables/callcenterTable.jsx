import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
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
import EditAsbezaOrderForm from "../EditForm/callcenterForm";
import Delete from "../../../api/orders/delete";
import MyHeaderComponent from "../../VersatileComponents/MyHeaderComponent";
import AsbezaOrderForm from "../CreateForm/callcenterForm";

const columns = [
  { key: "name", title: "Customer Name" },
  { key: "phone", title: "Phone" },
  { key: "blockHouse", title: "Block House" },
  { key: "deliveryguyName", title: "Delivery Guy Name" },
  { key: "branchName", title: "Branch Name" },
  { key: "order", title: "Order" },
  { key: "additionalInfo", title: "Additional Info" },
  { key: "status", title: "Status" }, // Added "Status" column
  { key: "edit", title: "Edit" },
  { key: "delete", title: "Delete" },
  { key: "new", title: "New" }, // Added "New" column
];

const AsbezaTable = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const [lastDoc, setLastDoc] = useState(null); // To keep track of the last document
  const [searchedData, setSearchedData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //   const [deleteRowId, setDeleteRowId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const handleEdit = (row) => {
    console.log("from the table", row);
    setEditRow(row);
    setIsEditDialogOpen(true);
  };
  const handleNew = (row) => {
    console.log("from the table", row);
    const newRow = {
      ...row,
      deliveryguyId: "",
      deliveryguyName: "",
      branchId: "",
      branchName: "",
      order: [],
      additionalInfo: "",
      activeTable: "",
      active: "",
      activeDailySummery: "",
    };

    setEditRow(newRow);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteItemId(id);
    console.log("delete id", id);
    openDeleteConfirmationDialog(id);
  };

  const handleDeleteConfirmed = async () => {
    setIsSubmitting(true);
    closeDeleteConfirmationDialog();
    try {
      // Attempt to delete the credit document
      const res = await Delete(user, deleteItemId, "asbeza");
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
      fetchFirestoreDataWithFilter(
        "Asbeza",
        null,
        8,
        data,
        setData,
        "callcenterId",
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
    if (searchText.trim() === "") {
      setSearchedData([]);
      loadInitialData();
      // Perform actions when the search input is empty
    } else {
      Search(
        "Asbeza",
        null,
        1000,
        searchedData,
        setSearchedData,
        "callcenterId",
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
        fetchFirestoreDataWithFilter(
          "Asbeza",
          lastDoc,
          5,
          data,
          setData,
          "callcenterId",
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

  const tableData = searchedData.length > 0 ? searchedData : data;
  return (
    <Box m="1rem 0">
      <MyHeaderComponent
        title="Asbeza Order"
        subtitle="Entire list of Asbeza Orders"
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={AsbezaOrderForm}
      />
      {/* <SearchInput onSearch={handleSearch} onCancel={handleCancel} /> */}
      <LoadingSpinner isSubmitting={isSubmitting} />
      <DynamicTable
        data={tableData}
        columns={columns}
        loadMoreData={loadMoreData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onNew={handleNew}
        orderType="asbeza"
      />
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        handleDialogClose={closeDeleteConfirmationDialog}
        handleConfirmed={handleDeleteConfirmed}
        message="Are you sure you want to delete this item?"
        title="Delete Confirmation"
      />
      {isEditDialogOpen && (
        <EditAsbezaOrderForm
          data={editRow}
          isEditDialogOpen={isEditDialogOpen}
          closeEditDialog={() => setIsEditDialogOpen(false)}
        />
      )}
    </Box>
  );
};

export default AsbezaTable;
