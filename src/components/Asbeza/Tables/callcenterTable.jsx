import React, { useContext, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import fetchFirestoreDataWithFilter from "../../../api/credit/get";
import Search from "../../../api/utils/search";
import SearchInput from "../../VersatileComponents/SearchInput";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import DynamicTable from "../../DynamicTable/DynamicTable";
import ConfirmationDialog from "../../VersatileComponents/ConfirmationDialog";
import EditAsbezaOrderForm from "../EditForm/callcenterForm";
import Delete from "../../../api/orders/delete";
import MyHeaderComponent from "../../VersatileComponents/MyHeaderComponent";
import AsbezaOrderForm from "../CreateForm/callcenterForm";
import useUserClaims from "../../../hooks/useUserClaims";
import findDocumentById from "../../../utils/findDocumentById";
import DeleteConfirmationDialog from "../../VersatileComponents/OrderDelete";
import getPast15Days from "../../../utils/getPast15Days";
import { format } from "date-fns";
import TableTab from "../../DashboardTable/TableTab";

const CallcenterColumn = [
  { key: "rollNumber", title: "No" },
  { key: "name", title: "Customer Name" },
  { key: "phone", title: "Phone" },
  { key: "blockHouse", title: "Block House" },
  { key: "deliveryguyName", title: "Delivery Guy Name" },
  { key: "branchName", title: "Branch Name" },
  { key: "callcenterName", title: "Callcenter Name" },
  { key: "order", title: "Order" },
  { key: "date", title: "Date" },
  { key: "additionalInfo", title: "Additional Info" },
  { key: "status", title: "Status" },
];

const columns = [
  ...CallcenterColumn,
  { key: "edit", title: "Edit" },
  { key: "new", title: "New" }, // Added "New" column
];

const AsbezaTable = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const { user } = useAuth();
  const userClaims = useUserClaims(user);
  const { openSnackbar } = useSnackbar();
  const [lastDoc, setLastDoc] = useState(null); // To keep track of the last document
  const [searchedData, setSearchedData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  //   const [deleteRowId, setDeleteRowId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [fromWhere, setFromWhere] = useState("edit");
  const [selectedTab, setSelectedTab] = useState(0);

  const currentDate = new Date();
  const getDates = getPast15Days(currentDate, 3);
  // Format and display the dates in a human-readable format (e.g., "YYYY-MM-DD")
  // const formattedDates = past15Days;
  const formattedDates = getDates.map((date) => format(date, "MMMM d, y"));
  console.log(formattedDates);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleEdit = (row) => {
    if (row.status !== "Assigned") {
      openSnackbar(
        `You can only edit new orders! This order Already ${row.status}`,
        "info"
      );
      return;
    }
    console.log("from the table", row);
    setEditRow(row);
    setFromWhere("edit");
    setIsEditDialogOpen(true);
  };
  const handleNew = (row) => {
    console.log("from the table", row);

    if (row.status !== "Completed") {
      openSnackbar(`You can only new orders if order is Completed!`, "info");
      return;
    }

    setEditRow(row);
    setFromWhere("new");
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteItemId(id);
    console.log("delete id", id);
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
      fetchFirestoreDataWithFilter(
        "Asbeza",
        null,
        10,
        data,
        setData,
        "callcenterId",
        params.id,
        "date",
        formattedDates[selectedTab]
      );
      // Set the last document for pagination
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [formattedDates[selectedTab]]);

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
        "Asbeza",
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
          "Asbeza",
          lastDoc,
          5,
          data,
          setData,
          "callcenterId",
          params.id,
          "date",
          formattedDates[selectedTab]
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
        title="Asbeza Order"
        subtitle="Entire list of Asbeza Orders"
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={AsbezaOrderForm}
      />
      {/* <SearchInput onSearch={handleSearch} onCancel={handleCancel} /> */}

      <TableTab
        tableDate={formattedDates}
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
      />
      <DynamicTable
        data={tableData}
        columns={userClaims.superAdmin ? CallcenterColumn : columns}
        loadMoreData={loadMoreData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onNew={handleNew}
        orderType="asbeza"
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
