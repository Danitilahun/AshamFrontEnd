import React, { useContext, useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useCallback } from "react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import fetchFirestoreDataWithFilter from "../../../api/credit/get";
import Search from "../../../api/utils/search";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import DynamicTable from "../../DynamicTable/DynamicTable";
import EditAsbezaOrderForm from "../EditForm/branchForm";
import Delete from "../../../api/orders/delete";
import AsbezaOrderBranchForm from "../CreateForm/branchForm";
import MyHeaderComponent from "../../VersatileComponents/MyHeaderComponent";
import useUserClaims from "../../../hooks/useUserClaims";
import findDocumentById from "../../../utils/findDocumentById";
import getPast15Days from "../../../utils/getPast15Days";
import TableTab from "../../DashboardTable/TableTab";
import { ExportToExcel } from "../../../utils/ExportToExcel";
import DeleteConfirmationDialog from "../../VersatileComponents/OrderDelete";
import getRequiredUserData from "../../../utils/getBranchInfo";

const main = [
  { key: "rollNumber", title: "No" },
  { key: "name", title: "Customer Name" },
  { key: "phone", title: "Phone" },
  { key: "blockHouse", title: "Block House" },
  { key: "deliveryguyName", title: "Delivery Guy Name" },
  { key: "order", title: "Order" },
  { key: "date", title: "Date" },
  { key: "additionalInfo", title: "Additional Info" },
];

let CallcenterColumn = [
  ...main,
  { key: "callcenterName", title: "Callcenter Name" },
  { key: "status", title: "Status" }, // Added "Status" column
  { key: "delete", title: "Delete" },
];
const columns = [
  ...main,
  { key: "status", title: "Status" }, // Added "Status" column
  { key: "edit", title: "Edit" },
  { key: "delete", title: "Delete" },
  { key: "new", title: "New" }, // Added "New" column
];

function pushOrUpdateWithKey(arr, newElement) {
  const existingIndex = arr.findIndex(
    (element) => element.key === newElement.key
  );

  if (existingIndex !== -1) {
    // An element with the same key already exists, you can replace it here.
    arr[existingIndex] = newElement;
  } else {
    // Insert the new element as the second-to-last item
    arr.splice(arr.length - 1, 0, newElement);
  }
  return arr;
}

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

const AsbezaTable = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const { user } = useAuth();
  const userClaim = useUserClaims(user);
  const [lastDoc, setLastDoc] = useState(null); // To keep track of the last document
  const [searchedData, setSearchedData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const { setIsSubmitting } = useContext(SpinnerContext);
  //   const [deleteRowId, setDeleteRowId] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { openSnackbar } = useSnackbar();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("callcenter");
  const [fromWhere, setFromWhere] = useState("edit");
  const userData = getRequiredUserData();
  // Function to handle view selection (Call Center or Branch)
  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  // Get the current date
  const currentDate = new Date();
  // Get an array of the past 15 days including the current date
  const past15Days = getPast15Days(currentDate);
  // Format and display the dates in a human-readable format (e.g., "YYYY-MM-DD")
  const formattedDates = past15Days.map((date) => format(date, "MMMM d, y"));

  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleEdit = (row) => {
    if (row.status !== "Assigned") {
      openSnackbar(
        `You can only edit Assigned! This order Already ${row.status}`,
        "info"
      );
      return;
    }

    setFromWhere("edit");
    setEditRow(row);
    setIsEditDialogOpen(true);
  };
  const handleNew = (row) => {
    if (row.status !== "Completed") {
      openSnackbar(`You can only new orders if order is Completed!`, "info");
      return;
    }
    setFromWhere("new");
    setEditRow(row);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id) => {
    openDeleteConfirmationDialog(id);
  };

  const handlePayDeleteConfirmed = async () => {
    setIsSubmitting(true);
    closeDeleteConfirmationDialog();
    try {
      // Attempt to delete the credit document
      const res = await Delete(user, deleteItemId, "asbeza", "pay");
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
  const handleUnPayDeleteConfirmed = async () => {
    setIsSubmitting(true);
    closeDeleteConfirmationDialog();
    try {
      // Attempt to delete the credit document
      const res = await Delete(user, deleteItemId, "asbeza", "unpay");
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
    const doc = findDocumentById(id, data);
    if (doc.status === "Completed") {
      openSnackbar(
        `Deleting individual completed order is not efficient. When you export to excel, we will export it and delete it from the database.`,
        "info"
      );
      return;
    }
    setDeleteItemId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteConfirmationDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const loadInitialData = async () => {
    try {
      setIsSubmitting(true);
      const filterField =
        selectedView === "callcenter" ? "branchId" : "callcenterId";
      fetchFirestoreDataWithFilter(
        "Asbeza",
        null,
        10,
        data,
        setData,
        filterField,
        params.id,
        "date",
        formattedDates[selectedTab]
      );
      // Set the last document for pagination
    } catch (error) {}
    setIsSubmitting(false);
  };

  useEffect(() => {
    loadInitialData();
  }, [selectedView, formattedDates[selectedTab]]);

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
      const filterField =
        selectedView === "callcenter" ? "branchId" : "callcenterId";
      Search(
        "Asbeza",
        null,
        1000,
        searchedData,
        setSearchedData,
        filterField,
        params.id,
        "blockHouse",
        searchText.toUpperCase()
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
          "Asbeza",
          lastDoc,
          5,
          data,
          setData,
          filterField,
          params.id,
          "date",
          formattedDates[selectedTab]
        );

        if (data.length > 0) {
          setLastDoc(data[data.length - 1]);
        }
      }
    } catch (error) {}
  }, [lastDoc, data, selectedView, formattedDates[selectedTab]]);

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

  const tableData = searchedData.length > 0 ? searchedData : data;
  if (userClaim.superAdmin && selectedView === "branch") {
    CallcenterColumn = CallcenterColumn.filter(
      (column) => column.key !== "callcenterName"
    );
  } else if (userClaim.superAdmin && selectedView !== "branch") {
    CallcenterColumn = pushOrUpdateWithKey(CallcenterColumn, {
      key: "callcenterName",
      title: "Callcenter Name",
    });
  }

  // Function to add a roll number to each student
  function addRollNumber(orderArray) {
    for (let i = 0; i < orderArray.length; i++) {
      orderArray[i].rollNumber = i + 1;
    }
  }

  // Call the function to add roll numbers
  addRollNumber(tableData);

  return (
    <Box m="1rem 0">
      <MyHeaderComponent
        title="Asbeza Order"
        subtitle="Entire list of Asbeza Orders"
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={AsbezaOrderBranchForm}
      />

      <div style={containerStyle}>
        <div style={flexItemStyle}>
          <Tabs
            value={selectedView}
            onChange={(e, newValue) => handleViewChange(newValue)}
            indicatorColor="secondary"
            textColor="secondary"
          >
            <Tab label="Call Center" value="callcenter" />
            <Tab label="Branch" value="branch" />
          </Tabs>
        </div>
        <div style={flexItemStyles}>
          {userClaim.superAdmin ? (
            <ExportToExcel
              file={"Asbeza"}
              branchId={userData.requiredId}
              id={""}
              endpoint={"asbeza"}
              clear={true}
              name={`AsbezaTable-Branch ${userData.branchName}`}
            />
          ) : null}
        </div>
      </div>

      <TableTab
        tableDate={formattedDates}
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
      />

      {tableData.length > 0 ? (
        <>
          <DynamicTable
            data={tableData}
            columns={
              selectedView === "callcenter" || userClaim.superAdmin
                ? CallcenterColumn
                : columns
            }
            loadMoreData={loadMoreData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNew={handleNew}
          />
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            fontSize: "2.5rem",
          }}
        >
          <p>There are no Asbeza orders in this day.</p>
        </div>
      )}

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        handleDialogClose={closeDeleteConfirmationDialog}
        handleUnPayConfirmed={handleUnPayDeleteConfirmed}
        handlePayConfirmed={handlePayDeleteConfirmed}
        message="You have two options: If you choose 'Pay' it means you are confirming payment for the service. Selecting 'Unpay' indicates that the delivery guy did not make the trip, and payment should not be processed. Are you sure you want to delete this item?"
        title="Delete Confirmation"
      />

      {isEditDialogOpen && (
        <EditAsbezaOrderForm
          data={editRow}
          isEditDialogOpen={isEditDialogOpen}
          closeEditDialog={() => setIsEditDialogOpen(false)}
          fromWhere={fromWhere}
        />
      )}
    </Box>
  );
};

export default AsbezaTable;
