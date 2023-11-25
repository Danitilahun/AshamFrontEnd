import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useCallback } from "react";
import EditEssentialForm from "./editEssentials";
import deleteEssential from "../../api/essential/delete";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/InfoContext";
import DynamicTable from "../DynamicTable/DynamicTable";
import ConfirmationDialog from "../VersatileComponents/ConfirmationDialog";
import useUserClaims from "../../hooks/useUserClaims";
import { SpinnerContext } from "../../contexts/SpinnerContext";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import fetchFirestoreDataWithPagination from "../../api/credit/fetchFirestoreDataWithPagination";
import MyHeaderComponent from "../VersatileComponents/MyHeaderComponent";
import Search from "../../api/utils/EssentialSearch";

const columns = [
  { key: "name", title: "Name" },
  { key: "address", title: "Address" },
  { key: "phone", title: "Phone" },
  { key: "company", title: "Company" },
  { key: "sector", title: "Sector" },
  {
    key: "edit",
    title: "Edit",
  },
  {
    key: "delete",
    title: "Delete",
  },
];

const NonSupercolumns = [
  { key: "name", title: "Name" },
  { key: "address", title: "Address" },
  { key: "phone", title: "Phone" },
  { key: "company", title: "Company" },
  { key: "sector", title: "Sector" },
  {
    key: "edit",
    title: "Edit",
  },
];

const EssentialTable = () => {
  const [data, setData] = useState([]);
  const { user } = useAuth();
  const userClaims = useUserClaims(user);
  const [lastDoc, setLastDoc] = useState(null); // To keep track of the last document
  const [searchedData, setSearchedData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const { setIsSubmitting } = useContext(SpinnerContext);
  //   const [deleteRowId, setDeleteRowId] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { openSnackbar } = useSnackbar();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = (row) => {
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
      const res = await deleteEssential(user, deleteItemId);
      openSnackbar(`${res.data.message}!`, "success");
      // Check if the deletion was successful
    } catch (error) {
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
      fetchFirestoreDataWithPagination("Essentials", null, 5, data, setData);
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

  const handleSearch = async (searchText, field) => {
    if (searchText.trim() === "") {
      setSearchedData([]);
      loadInitialData();
      // Perform actions when the search input is empty
    } else {
      const capitalizedText =
        searchText.charAt(0).toUpperCase() + searchText.slice(1);
      Search(
        "Essentials",
        null,
        1000,
        searchedData,
        setSearchedData,
        "name",
        capitalizedText
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
        fetchFirestoreDataWithPagination(
          "Essentials",
          lastDoc,
          5,
          data,
          setData
        );

        if (data.length > 0) {
          setLastDoc(data[data.length - 1]);
        }
      }
    } catch (error) {}
  }, [lastDoc, data]);

  useEffect(() => {
    const handleDynamicTableScroll = (event) => {
      const scrollPosition = event.detail.scrollPosition;
    };

    window.addEventListener("dynamicTableScroll", handleDynamicTableScroll);

    return () => {
      window.removeEventListener(
        "dynamicTableScroll",
        handleDynamicTableScroll
      );
    };
  }, []);

  const { screenWidth, screenHeight } = useWindowDimensions();
  const tableData = searchedData.length > 0 ? searchedData : data;

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {/* <p> size : {(screenHeight * 65) / 100}</p> */}
      <MyHeaderComponent
        title=""
        subtitle=""
        onSearch={handleSearch}
        onCancel={handleCancel}
      />
      <DynamicTable
        data={tableData}
        columns={userClaims.superAdmin ? columns : NonSupercolumns}
        loadMoreData={loadMoreData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        from={"Essential"}
        containerHeight={(screenHeight * 39) / 100}
      />
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        handleDialogClose={closeDeleteConfirmationDialog}
        handleConfirmed={handleDeleteConfirmed} // Create this function next
        message="Are you sure you want to delete this item?"
        title="Delete Confirmation"
      />
      {isEditDialogOpen && (
        <EditEssentialForm
          data={editRow}
          isEditDialogOpen={isEditDialogOpen} // Pass the state
          closeEditDialog={() => setIsEditDialogOpen(false)} // Pass the close function
        />
      )}
    </Box>
  );
};

export default EssentialTable;
