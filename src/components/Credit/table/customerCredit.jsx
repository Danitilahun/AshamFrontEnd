import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import DynamicTable from "../../DynamicTable/DynamicTable";
import EditCustomerCreditForm from "../editCreditForm/customerCredit";
import deleteCredit from "../../../api/credit/delete";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import ConfirmationDialog from "../../VersatileComponents/ConfirmationDialog";
import fetchFirestoreDataWithFilter from "../../../api/credit/get";
import Search from "../../../api/utils/search";
import CustomerCreditForm from "../createCreditForm/customerCredit";
import MyHeaderComponent from "../../VersatileComponents/creditHeader";
import useUserClaims from "../../../hooks/useUserClaims";
import capitalizeString from "../../../utils/capitalizeString";
import getRequiredUserData from "../../../utils/getBranchInfo";
import { ExportToExcel } from "../../../utils/ExportToExcel";

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
const NonAdmincolumns = [
  { key: "name", title: "Name" },
  { key: "amount", title: "Amount" },
  { key: "reason", title: "Reason" },
  { key: "address", title: "Address" },
  { key: "phone", title: "Phone" },
  { key: "date", title: "BorrowedOn" },
  { key: "daysSinceBorrowed", title: "Days Since Borrowed" },
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
const CustomerCreditTable = () => {
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
  const branchData = getRequiredUserData();
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
      const res = await deleteCredit(user, deleteItemId, "CustomerCredit");

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
      await fetchFirestoreDataWithFilter(
        "CustomerCredit",
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
        "CustomerCredit",
        null,
        1000,
        searchedData,
        setSearchedData,
        "branchId",
        params.id,
        "name",
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
    type: "CustomerCredit",
  };

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
  const searchResult = processArrayOfObjects(searchedData);

  const tableData = searchedData.length > 0 ? searchResult : processedData;

  return (
    <Box m="1rem 0">
      <MyHeaderComponent
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={CustomerCreditForm}
        formProps={formProps}
      />
      <div style={containerStyle}>
        <div style={flexItemStyle}></div>
        <div style={flexItemStyles}>
          {userClaim.superAdmin ? (
            <ExportToExcel
              file={"CustomerCredit"}
              branchId={branchData.requiredId}
              id={""}
              endpoint={"customerC"}
              clear={false}
              name={`CustomerCreditTable-Branch ${branchData.branchName}`}
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
