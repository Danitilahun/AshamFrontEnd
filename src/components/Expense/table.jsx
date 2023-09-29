import React, { useContext, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import fetchFirestoreDataWithFilter from "../../api/credit/get";
import ExpenseEditForm from "./edit";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/InfoContext";
import LoadingSpinner from "../VersatileComponents/LoadingSpinner";
import DynamicTable from "../DynamicTable/DynamicTable";
import ConfirmationDialog from "../VersatileComponents/ConfirmationDialog";
import deleteExpense from "../../api/expense/delete";
import useUserClaims from "../../hooks/useUserClaims";
import { SpinnerContext } from "../../contexts/SpinnerContext";

const columns = [
  { key: "name", title: "Name" },
  { key: "amount", title: "Amount" },
  {
    key: "edit",
    title: "Edit",
  },
  {
    key: "delete",
    title: "Delete",
  },
];
const NonFinancecolumns = [
  { key: "name", title: "Name" },
  { key: "amount", title: "Amount" },
];

const ExpenseTable = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const { user } = useAuth();
  const userClaim = useUserClaims(user);
  const [lastDoc, setLastDoc] = useState(null); // To keep track of the last document
  const [searchedData, setSearchedData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  //   const [deleteRowId, setDeleteRowId] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { openSnackbar } = useSnackbar();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = (row) => {
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
      const res = await deleteExpense(user, deleteItemId, "CustomerCredit");
      // Check if the deletion was successful
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
      await fetchFirestoreDataWithFilter(
        "Expense",
        null,
        10,
        data,
        setData,
        null,
        null
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
          "Expense",
          lastDoc,
          5,
          data,
          setData,
          null,
          null
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
    <Box m="1rem 0">
      <DynamicTable
        data={data}
        columns={userClaim.finance ? columns : NonFinancecolumns}
        loadMoreData={loadMoreData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        handleDialogClose={closeDeleteConfirmationDialog}
        handleConfirmed={handleDeleteConfirmed} // Create this function next
        message="Are you sure you want to delete this item?"
        title="Delete Confirmation"
      />
      {isEditDialogOpen && (
        <ExpenseEditForm
          credit={editRow}
          isEditDialogOpen={isEditDialogOpen} // Pass the state
          closeEditDialog={() => setIsEditDialogOpen(false)} // Pass the close function
        />
      )}
    </Box>
  );
};

export default ExpenseTable;
