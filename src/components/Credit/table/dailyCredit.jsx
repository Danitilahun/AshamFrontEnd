import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import DynamicTable from "../../DynamicTable/DynamicTable";
import deleteCredit from "../../../api/credit/delete";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import ConfirmationDialog from "../../VersatileComponents/ConfirmationDialog";
import fetchFirestoreDataWithFilter from "../../../api/credit/get";
import EditDailyCreditForm from "../editCreditForm/dailyCredit";
import Search from "../../../api/utils/search";
import DailyCreditForm from "../createCreditForm/dailyCredit";
import MyHeaderComponent from "../../VersatileComponents/creditHeader";
import useUserClaims from "../../../hooks/useUserClaims";
import capitalizeString from "../../../utils/capitalizeString";

const columns = [
  { key: "deliveryguyName", title: "Delivery Guy Name" },
  { key: "reason", title: "Reason" },
  { key: "gain", title: "Amount" },
  {
    key: "edit",
    title: "Edit",
  },
  {
    key: "delete",
    title: "Delete",
  },
];
const NonAdmincolumns = [
  { key: "deliveryguyName", title: "Delivery Guy Name" },
  { key: "reason", title: "Reason" },
  { key: "amount", title: "Amount" },
];

const DailyCreditTable = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const { user } = useAuth();
  const userClaim = useUserClaims(user);
  const [lastDoc, setLastDoc] = useState(null); // To keep track of the last document
  const [searchedData, setSearchedData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const { setIsSubmitting } = useContext(SpinnerContext);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { openSnackbar } = useSnackbar();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = (row) => {
    if (row.source === "Report") {
      openSnackbar(
        `You can not edit this credit! This credit is from ${row.source}!`,
        "info"
      );
      return;
    }
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
      const res = await deleteCredit(user, deleteItemId, "DailyCredit");

      // Check if the deletion was successful
      openSnackbar(`${res.data.message}!`, "success");
    } catch (error) {
      if (error.response && error.response.data) {
        openSnackbar(
          error.response.data.message,
          error.response.data.type ? error.response.data.type : "error"
        );
      } else {
        openSnackbar(
          "An unexpected error occurred.Please kindly check your connection.",
          "error"
        );
      }
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
        "DailyCredit",
        null,
        10,
        data,
        setData,
        "branchId",
        params.id
      );
      // Set the last document for pagination
    } catch (error) {}
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
    // Perform additional actions when searching here

    if (searchText.trim() === "") {
      setSearchedData([]);
      loadInitialData();
      // Perform actions when the search input is empty
    } else {
      const searchTextNew = capitalizeString(searchText);
      Search(
        "DailyCredit",
        null,
        1000,
        searchedData,
        setSearchedData,
        "branchId",
        params.id,
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
          "DailyCredit",
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
    type: "DailyCredit",
  };

  const tableData = searchedData.length > 0 ? searchedData : data;
  return (
    <Box m="1rem 0">
      <MyHeaderComponent
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={DailyCreditForm}
        formProps={formProps}
      />

      <DynamicTable
        data={tableData}
        columns={userClaim.admin ? columns : NonAdmincolumns}
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
        <EditDailyCreditForm
          credit={editRow}
          isEditDialogOpen={isEditDialogOpen} // Pass the state
          closeEditDialog={() => setIsEditDialogOpen(false)} // Pass the close function
        />
      )}
    </Box>
  );
};

export default DailyCreditTable;
