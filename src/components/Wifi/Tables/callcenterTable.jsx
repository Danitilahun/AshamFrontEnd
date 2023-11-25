import React, { useContext, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import fetchFirestoreDataWithFilter from "../../../api/credit/get";
import Search from "../../../api/utils/search";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import DynamicTable from "../../DynamicTable/DynamicTable";
import SearchInput from "../../VersatileComponents/SearchInput";
import ConfirmationDialog from "../../VersatileComponents/ConfirmationDialog";
import EditWifiOrderForm from "../EditForm/callcenterForm";
import Delete from "../../../api/orders/delete";
import MyHeaderComponent from "../../VersatileComponents/MyHeaderComponent";
import WifiOrderForm from "../CreateForm/callcenterForm";
import ReminderComponent from "../../VersatileComponents/Reminder";
import useUserClaims from "../../../hooks/useUserClaims";
import findDocumentById from "../../../utils/findDocumentById";
import DeleteConfirmationDialog from "../../VersatileComponents/OrderDelete";
import getPast15Days from "../../../utils/getPast15Days";
import { format } from "date-fns";
import TableTab from "../../DashboardTable/TableTab";
import getPreviousDaysFromToday from "../../../utils/getNextDaysFromDate";
import WWTableTab from "../../VersatileComponents/waterAndwifi";

const CallcenterColumn = [
  { key: "rollNumber", title: "No" },
  { key: "name", title: "Customer Name" },
  { key: "phone", title: "Phone" },
  { key: "blockHouse", title: "Block House" },
  { key: "deliveryguyName", title: "Delivery Guy Name" },
  { key: "branchName", title: "Branch Name" },
  { key: "callcenterName", title: "Callcenter Name" },
  { key: "ownerName", title: "Owner Name" },
  { key: "date", title: "Date" },
  { key: "accountNumber", title: "Account Number" },
  { key: "status", title: "Status" },
];
const columns = [
  ...CallcenterColumn,
  { key: "edit", title: "Edit" },
  { key: "new", title: "New" },
];

const WifiTable = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const { user } = useAuth();
  const userClaims = useUserClaims(user);
  const [lastDoc, setLastDoc] = useState(null); // To keep track of the last document
  const [searchedData, setSearchedData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  //   const [deleteRowId, setDeleteRowId] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { openSnackbar } = useSnackbar();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fromWhere, setFromWhere] = useState("edit");

  // const [selectedTab, setSelectedTab] = useState(0);

  const currentDate = new Date();
  const getDates = getPast15Days(currentDate, 3);
  // Format and display the dates in a human-readable format (e.g., "YYYY-MM-DD")
  // const formattedDates = past15Days;
  const formattedDates = getDates.map((date) => format(date, "MMMM d, y"));
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
      const res = await Delete(user, deleteItemId, "wifi", "pay");
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
      const res = await Delete(user, deleteItemId, "wifi", "unpay");
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
  // const handleDeleteConfirmed = async () => {
  //   setIsSubmitting(true);
  //   closeDeleteConfirmationDialog();
  //   try {
  //     // Attempt to delete the credit document
  //     const res = await Delete(user, deleteItemId, "wifi");
  //     openSnackbar(`${res.data.message}!`, "success");
  //   } catch (error) {
  //     if (error.response && error.response.data) {
  //       openSnackbar(
  //         error.response.data.message,
  //         error.response.data.type ? error.response.data.type : "error"
  //       );
  //     } else {
  //       openSnackbar(
  //         "An unexpected error occurred.Please kindly check your connection.",
  //         "error"
  //       );
  //     }
  //   }

  //   setIsSubmitting(false);
  //   setDeleteItemId(null);
  // };
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
      fetchFirestoreDataWithFilter(
        "Wifi",
        null,
        10,
        data,
        setData,
        "callcenterId",
        params.id,
        "date",
        field === "Date" ? formattedDates[selectedTab] : days[selectedTab1]
      );
      // Set the last document for pagination
    } catch (error) {}
  };

  useEffect(() => {
    loadInitialData();
  }, [formattedDates[selectedTab], selectedTab1, field]);

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
        "Wifi",
        null,
        1000,
        searchedData,
        setSearchedData,
        "callcenterId",
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
        fetchFirestoreDataWithFilter(
          "Wifi",
          lastDoc,
          5,
          data,
          setData,
          "callcenterId",
          params.id,
          "date",
          field === "Date" ? formattedDates[selectedTab] : days[selectedTab1]
        );

        if (data.length > 0) {
          setLastDoc(data[data.length - 1]);
        }
      }
    } catch (error) {}
  }, [lastDoc, data, selectedTab1, field]);

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
        title="Wifi Order"
        subtitle="Entire list of Wifi Orders"
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={WifiOrderForm}
      />
      {/* <SearchInput onSearch={handleSearch} onCancel={handleCancel} /> */}

      {userClaims.callCenter && (
        <Grid container spacing={2}>
          <Grid item xs={3}></Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReminderComponent type={"Wifi Order"} />
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      )}
      {/* 
      <TableTab
        tableDate={formattedDates}
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
      /> */}

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TableTab
            tableDate={formattedDates}
            selectedTab={selectedTab}
            handleTabChange={handleTabChange}
            from="wifi"
          />
        </Grid>
        <Grid item xs={6}>
          <WWTableTab
            tableDate={days}
            selectedTab={selectedTab1}
            handleTabChange={handleTabChange1}
            from="wifi"
          />
        </Grid>
      </Grid>

      <DynamicTable
        data={tableData}
        columns={userClaims.superAdmin ? CallcenterColumn : columns}
        loadMoreData={loadMoreData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onNew={handleNew}
        orderType="wifi"
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        handleDialogClose={closeDeleteConfirmationDialog}
        handleUnPayConfirmed={handleUnPayDeleteConfirmed}
        handlePayConfirmed={handlePayDeleteConfirmed}
        message="You have two options: If you choose 'Pay' it means you are confirming payment for the service. Selecting 'Unpay' indicates that the delivery guy did not make the trip, and payment should not be processed. Are you sure you want to delete this item?"
        title="Delete Confirmation"
      />
      {isEditDialogOpen && (
        <EditWifiOrderForm
          data={editRow}
          isEditDialogOpen={isEditDialogOpen}
          closeEditDialog={() => setIsEditDialogOpen(false)}
          fromWhere={fromWhere}
        />
      )}
    </Box>
  );
};

export default WifiTable;
