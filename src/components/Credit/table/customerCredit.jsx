import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import SearchInput from "../../VersatileComponents/SearchInput";
import DynamicTable from "../../DynamicTable/DynamicTable";
import EditCustomerCreditForm from "../editCreditForm/customerCredit";
import deleteCredit from "../../../api/credit/delete";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import LoadingSpinner from "../../VersatileComponents/LoadingSpinner";
import ConfirmationDialog from "../../VersatileComponents/ConfirmationDialog";
import fetchFirestoreDataWithFilter from "../../../api/credit/get";
import Search from "../../../api/utils/search";
import MyHeaderComponent from "../../VersatileComponents/MyHeaderComponent";
import CustomerCreditForm from "../createCreditForm/customerCredit";

const columns = [
  { key: "name", title: "Name" },
  { key: "amount", title: "Amount" },
  { key: "reason", title: "Reason" },
  { key: "address", title: "Address" },
  { key: "phone", title: "Phone" },
  { key: "date", title: "BorrowedOn" },
  { key: "daysSinceBorrowed", title: "Days Since Borrowed" },
  {
    key: "edit",
    title: "Edit",
  },
  {
    key: "delete",
    title: "Delete",
  },
];

const CustomerCreditTable = () => {
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
      const res = await deleteCredit(user, deleteItemId, "CustomerCredit");

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
        "CustomerCredit",
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

  function processArrayOfObjects(data) {
    const currentDate = new Date();

    return data.map((item) => {
      const createdDate = new Date(item.date);
      const dayDifference = Math.floor(
        (currentDate - createdDate) / (1000 * 60 * 60 * 24)
      );
      item.daysSinceBorrowed = dayDifference;
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

  const handleSearch = async (searchText) => {
    console.log("Search Text:", searchText, searchText === "");

    // Perform additional actions when searching here

    if (searchText.trim() === "") {
      setSearchedData([]);
      loadInitialData();
      // Perform actions when the search input is empty
    } else {
      Search(
        "CustomerCredit",
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
          "CustomerCredit",
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

  const formProps = {
    type: "CustomerCredit",
  };

  const tableData = searchedData.length > 0 ? searchedData : processedData;

  return (
    <Box m="1rem 0">
      <MyHeaderComponent
        title="Customer credit"
        subtitle="Entire list of Customer credits"
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={CustomerCreditForm}
        formProps={formProps}
      />
      <LoadingSpinner isSubmitting={isSubmitting} />
      <DynamicTable
        data={tableData}
        columns={columns}
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
        <EditCustomerCreditForm
          credit={editRow}
          isEditDialogOpen={isEditDialogOpen} // Pass the state
          closeEditDialog={() => setIsEditDialogOpen(false)} // Pass the close function
        />
      )}
    </Box>
  );
};

export default CustomerCreditTable;
