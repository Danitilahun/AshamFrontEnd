import React, { useContext, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import SearchInput from "../../VersatileComponents/SearchInput";
import DynamicTable from "../../DynamicTable/DynamicTable";
import deleteCredit from "../../../api/credit/delete";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import ConfirmationDialog from "../../VersatileComponents/ConfirmationDialog";
import fetchFirestoreDataWithFilter from "../../../api/credit/get";
import Search from "../../../api/utils/search";
import EditForm from "../EditForm/edit";
import Header from "../../VersatileComponents/Header";
import deleteIncentive from "../../../api/bonusPenality/delete";
import CreateForm from "../createForm/create";
import MyHeaderComponent from "../../VersatileComponents/MyHeaderComponent";
import useUserClaims from "../../../hooks/useUserClaims";
import capitalizeString from "../../../utils/capitalizeString";
import { ExportToExcel } from "../../../utils/ExportToExcel";
import getRequiredUserData from "../../../utils/getBranchInfo";

const columns = [
  { key: "employeeName", title: "Employee Name" },
  { key: "placement", title: "Placement" },
  { key: "reason", title: "Reason" },
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

const containerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  alignItems: "center",
  // backgroundColor: "green",
};

const flexItemStyle = {
  flex: 9,
};

const flexItemStyles = {
  flex: 1,
};
const NonAdmincolumns = [
  { key: "employeeName", title: "Employee Name" },
  { key: "placement", title: "Placement" },
  { key: "reason", title: "Reason" },
  { key: "amount", title: "Amount" },
];

const BonusPenalityTable = ({ type }) => {
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
  const branchData = getRequiredUserData();

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

      const response = await deleteIncentive(
        user,
        deleteItemId,
        type === "Bonus" ? "bonus" : "penality"
      );

      // Check if the deletion was successful
      if (response.data && response.data.message) {
        openSnackbar(response.data.message, "success");
      } else {
        openSnackbar("Deletion was successful.", "success");
      }
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
        type,
        null,
        10,
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
    // console.log("Search Text:", searchText, searchText === "");

    // Perform additional actions when searching here

    if (searchText.trim() === "") {
      setSearchedData([]);
      loadInitialData();
      // Perform actions when the search input is empty
    } else {
      const searchTextNew = capitalizeString(searchText);
      Search(
        type,
        null,
        1000,
        searchedData,
        setSearchedData,
        "branchId",
        params.id,
        "employeeName",
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
          type,
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
    type: type === "Bonus" ? "bonus" : "penality",
  };

  const tableData = searchedData.length > 0 ? searchedData : data;
  return (
    <Box m="1rem 0">
      <MyHeaderComponent
        title={type}
        subtitle={`Entire list of ${type}`} // Pass the subtitle as a prop
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={CreateForm}
        formProps={formProps}
        from="BonusPenality"
      />
      {/* <Header title={type} subtitle={`Entire list of ${type}`} /> */}
      {/* <SearchInput onSearch={handleSearch} onCancel={handleCancel} /> */}

      <div style={containerStyle}>
        <div style={flexItemStyle}></div>
        <div style={flexItemStyles}>
          {userClaim.superAdmin ? (
            <ExportToExcel
              file={type}
              branchId={branchData.requiredId}
              id={""}
              endpoint={type === "Bonus" ? "bonus" : "penality"}
              clear={false}
              name={`${type}Table-Branch ${branchData.branchName}`}
            />
          ) : null}
        </div>
      </div>
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
        <EditForm
          data={editRow}
          type={type === "Bonus" ? "bonus" : "penality"}
          isEditDialogOpen={isEditDialogOpen} // Pass the state
          closeEditDialog={() => setIsEditDialogOpen(false)} // Pass the close function
        />
      )}
    </Box>
  );
};

export default BonusPenalityTable;
