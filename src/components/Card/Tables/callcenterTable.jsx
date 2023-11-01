import React, { useContext, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import { format } from "date-fns";
import Search from "../../../api/utils/search";
import SearchInput from "../../VersatileComponents/SearchInput";
import DynamicTable from "../../DynamicTable/DynamicTable";
import ConfirmationDialog from "../../VersatileComponents/ConfirmationDialog";
import EditCardOrderForm from "../EditForm/callcenterForm";
import Delete from "../../../api/orders/delete";
import MyHeaderComponent from "../../VersatileComponents/MyHeaderComponent";
import CardOrderForm from "../CreateForm/callcenterForm";
import findDocumentById from "../../../utils/findDocumentById";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import useUserClaims from "../../../hooks/useUserClaims";
import DeleteConfirmationDialog from "../../VersatileComponents/OrderDelete";
import CardTableTab from "../../DashboardTable/cardDateTab";
import TableTab from "../../DashboardTable/cardTab";
import getPast15Days from "../../../utils/getPast15Days";
import getPastDays from "../../../utils/dayRemain";
import fetchFirestoreDataWithFilter from "../../../api/credit/get";

const CallcenterColumn = [
  { key: "name", title: "Customer Name" },
  { key: "phone", title: "Phone" },
  { key: "blockHouse", title: "Block House" },
  { key: "dayRemain", title: "Day Remain" },
  { key: "remaingMoney", title: "Money Remain" },
  { key: "deliveryguyName", title: "Delivery Guy Name" },
  { key: "branchName", title: "Branch Name" },
  { key: "callcenterName", title: "Callcenter Name" },
  { key: "amountBirr", title: "Amount" },
  { key: "date", title: "Date" },
  { key: "status", title: "Status" },
];
const columns = [
  ...CallcenterColumn,
  { key: "edit", title: "Edit" },
  { key: "delete", title: "Delete" },
  { key: "new", title: "New" },
];

const CardTable = () => {
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

  // Get an array of the past 15 days including the current date
  const past15Days = getPastDays(3);
  const currentDate = new Date();
  const getDates = getPast15Days(currentDate, 3);
  // Format and display the dates in a human-readable format (e.g., "YYYY-MM-DD")
  // const formattedDates = past15Days;
  const formattedDates = getDates.map((date) => format(date, "MMMM d, y"));
  console.log(formattedDates);

  const [selectedTab, setSelectedTab] = useState(null);
  const [selectedTab1, setSelectedTab1] = useState(0);
  const [field, setField] = useState("date");
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setField("dayRemain");
    setSelectedTab1(null);
  };
  const handleTabChange1 = (event, newValue) => {
    setSelectedTab1(newValue);
    setField("date");
    setSelectedTab(null);
  };

  const handleEdit = (row) => {
    console.log("from the table", row);
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
      const res = await Delete(user, deleteItemId, "card", "pay");
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
      const res = await Delete(user, deleteItemId, "card", "unpay");
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
      const value =
        field == "date" ? formattedDates[selectedTab1] : selectedTab;
      console.log(field, value);
      fetchFirestoreDataWithFilter(
        "Card",
        null,
        10,
        data,
        setData,
        "callcenterId",
        params.id,
        field,
        value
      );
      // Set the last document for pagination
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };
  // const loadInitialData = async () => {
  //   try {
  //     fetchFirestoreDataWithFilter(
  //       "Card",
  //       null,
  //       10,
  //       data,
  //       setData,
  //       "callcenterId",
  //       params.id
  //     );
  //     // Set the last document for pagination
  //   } catch (error) {
  //     console.error("Error loading initial data:", error);
  //   }
  // };

  useEffect(() => {
    loadInitialData();
  }, [formattedDates[selectedTab], field, selectedTab1]);

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
        "Card",
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
      const value =
        field == "date" ? formattedDates[selectedTab1] : selectedTab;
      console.log(field, value);
      if (lastDoc) {
        fetchFirestoreDataWithFilter(
          "Card",
          lastDoc,
          5,
          data,
          setData,
          "callcenterId",
          params.id,
          field,
          value
        );

        if (data.length > 0) {
          setLastDoc(data[data.length - 1]);
        }
      }
    } catch (error) {
      console.error("Error loading more data:", error);
    }
  }, [lastDoc, data, formattedDates[selectedTab], field, selectedTab1]);

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
  return (
    <Box m="1rem 0">
      <MyHeaderComponent
        title="Card Order"
        subtitle="Entire list of Card Orders"
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={CardOrderForm}
      />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <CardTableTab
            tableDate={formattedDates}
            selectedTab={selectedTab1}
            handleTabChange={handleTabChange1}
            from="card"
          />
        </Grid>
        <Grid item xs={6}>
          <TableTab
            tableDate={past15Days}
            selectedTab={selectedTab}
            handleTabChange={handleTabChange}
            from="card"
          />
        </Grid>
      </Grid>
      {/* <SearchInput onSearch={handleSearch} onCancel={handleCancel} /> */}

      {tableData.length > 0 ? (
        <DynamicTable
          data={tableData}
          columns={userClaims.superAdmin ? CallcenterColumn : columns}
          loadMoreData={loadMoreData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onNew={handleNew}
          orderType="card"
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
          <p>
            There are no Card orders{" "}
            {field == "date" ? "in this day" : "remain this much day"}.
          </p>
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
        <EditCardOrderForm
          data={editRow}
          isEditDialogOpen={isEditDialogOpen}
          closeEditDialog={() => setIsEditDialogOpen(false)}
          fromWhere={fromWhere}
        />
      )}
    </Box>
  );
};

export default CardTable;
