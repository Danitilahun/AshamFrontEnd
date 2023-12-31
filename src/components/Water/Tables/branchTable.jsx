import React, { useContext, useEffect, useState } from "react";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import fetchFirestoreDataWithFilter from "../../../api/credit/get";
import Search from "../../../api/utils/search";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import DynamicTable from "../../DynamicTable/DynamicTable";
import EditWaterOrderForm from "../EditForm/branchForm";
import Delete from "../../../api/orders/delete";
import MyHeaderComponent from "../../VersatileComponents/MyHeaderComponent";
import WaterOrderBranchForm from "../CreateForm/branchForm";
import findDocumentById from "../../../utils/findDocumentById";
import useUserClaims from "../../../hooks/useUserClaims";
import { format } from "date-fns";
import getPast15Days from "../../../utils/getPast15Days";
import TableTab from "../../DashboardTable/TableTab";
import { ExportToExcel } from "../../../utils/ExportToExcel";
import getRequiredUserData from "../../../utils/getBranchInfo";
import DeleteConfirmationDialog from "../../VersatileComponents/OrderDelete";
import getPreviousDaysFromToday from "../../../utils/getNextDaysFromDate";
import WWTableTab from "../../VersatileComponents/waterAndwifi";
const main = [
  { key: "rollNumber", title: "No" },
  { key: "name", title: "Customer Name" },
  { key: "phone", title: "Phone" },
  { key: "blockHouse", title: "Block House" },
  { key: "billPayerName", title: "Bill Payer Name" },
  { key: "customerKey", title: "Customer Key" },
  { key: "date", title: "Date" },
  { key: "deliveryguyName", title: "Delivery Guy Name" },
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
    arr[existingIndex] = newElement;
  } else {
    arr.splice(arr.length - 1, 0, newElement);
  }
  return arr;
}

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

const WaterTable = () => {
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
  const past15Days = getPast15Days(currentDate, 3);
  // Format and display the dates in a human-readable format (e.g., "YYYY-MM-DD")
  const formattedDates = past15Days.map((date) => format(date, "MMMM d, y"));
  // const [selectedTab, setSelectedTab] = useState(0);
  const days = getPreviousDaysFromToday();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedTab1, setSelectedTab1] = useState(null);
  const [field, setField] = useState("Date");

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setField("Date");
    setSelectedTab1(null);
  };

  const handleTabChange1 = (event, newValue) => {
    setSelectedTab1(newValue);
    setField("DateRemain");
    setSelectedTab(null);
  };
  const handleEdit = (row) => {
    if (row.status !== "Assigned") {
      openSnackbar(
        `You can only edit new orders! This order Already ${row.status}`,
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
      const res = await Delete(user, deleteItemId, "water", "pay");
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
      const res = await Delete(user, deleteItemId, "water", "unpay");
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
      const filterField =
        selectedView === "callcenter" ? "branchId" : "callcenterId";

      fetchFirestoreDataWithFilter(
        "Water",
        null,
        10,
        data,
        setData,
        filterField,
        params.id,
        "date",
        field === "Date" ? formattedDates[selectedTab] : days[selectedTab1]
      );
      // Set the last document for pagination
    } catch (error) {}
  };

  useEffect(() => {
    loadInitialData();
  }, [selectedView, formattedDates[selectedTab], selectedTab1, field]);

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
        searchText.toUpperCase()
      );
    }
  };

  const handleCancel = () => {
    setSearchedData([]);
    loadInitialData();
  };

  const loadMoreData = useCallback(
    async () => {
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
            params.id,
            "date",
            field === "Date" ? formattedDates[selectedTab] : days[selectedTab1]
          );

          if (data.length > 0) {
            setLastDoc(data[data.length - 1]);
          }
        }
      } catch (error) {}
    },
    [lastDoc, data, selectedView, formattedDates[selectedTab]],
    selectedTab1,
    field
  );

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
        title="Water Order"
        subtitle="Entire list of Water Orders"
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={WaterOrderBranchForm}
      />

      <div style={containerStyle}>
        <div style={flexItemStyle}>
          <Tabs
            value={selectedView}
            onChange={(e, newValue) => handleViewChange(newValue)}
            indicatorColor="secondary"
            textColor="secondary"
            scrollable="true"
          >
            <Tab label="Call Center" value="callcenter" />
            <Tab label="Branch" value="branch" />
          </Tabs>
        </div>
        <div style={flexItemStyles}>
          {userClaim.superAdmin ? (
            <ExportToExcel
              file={"Water"}
              branchId={userData.requiredId}
              id={""}
              endpoint={"water"}
              clear={true}
              name={`WaterTable-Branch ${userData.branchName}`}
            />
          ) : null}
        </div>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TableTab
            tableDate={formattedDates}
            selectedTab={selectedTab}
            handleTabChange={handleTabChange}
            from="water"
          />
        </Grid>
        <Grid item xs={6}>
          <WWTableTab
            tableDate={days}
            selectedTab={selectedTab1}
            handleTabChange={handleTabChange1}
            from="water"
          />
        </Grid>
      </Grid>
      {/* <SearchInput onSearch={handleSearch} onCancel={handleCancel} /> */}

      {tableData.length > 0 ? (
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
          orderType="water"
        />
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
          <p>There are no Water orders in this day.</p>
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
        <EditWaterOrderForm
          data={editRow}
          isEditDialogOpen={isEditDialogOpen}
          closeEditDialog={() => setIsEditDialogOpen(false)}
          fromWhere={fromWhere}
        />
      )}
    </Box>
  );
};

export default WaterTable;
