import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import DynamicTable from "../../DynamicTable/DynamicTable";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import ConfirmationDialog from "../../VersatileComponents/ConfirmationDialog";
import fetchFirestoreDataWithFilter from "../../../api/credit/get";
import Search from "../../../api/utils/search";
import EditForm from "../EditForm/edit";
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
  const { setIsSubmitting } = useContext(SpinnerContext);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { openSnackbar } = useSnackbar();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const branchData = getRequiredUserData();

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
    if (searchText.trim() === "") {
      setSearchedData([]);
      loadInitialData();
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

      <div style={containerStyle}>
        <div style={flexItemStyle}></div>
        <div style={flexItemStyles}>
          {userClaim.superAdmin || userClaim.finance ? (
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
