import React, { useContext, useEffect, useState } from "react";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import fetchFirestoreDataWithFilter from "../../../api/credit/get";
import Search from "../../../api/utils/search";
import SearchInput from "../../VersatileComponents/SearchInput";
import DynamicTable from "../../DynamicTable/DynamicTable";
import ConfirmationDialog from "../../VersatileComponents/ConfirmationDialog";
import EditCardOrderForm from "../EditForm/branchForm";
import Delete from "../../../api/orders/delete";
import CardOrderBranchForm from "../CreateForm/branchForm";
import MyHeaderComponent from "../../VersatileComponents/MyHeaderComponent";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import useUserClaims from "../../../hooks/useUserClaims";
import findDocumentById from "../../../utils/findDocumentById";
import TableTab from "../../DashboardTable/cardTab";
import { ExportToExcel } from "../../../utils/ExportToExcel";
import getRequiredUserData from "../../../utils/getBranchInfo";
import DeleteConfirmationDialog from "../../VersatileComponents/OrderDelete";
import getPastDays from "../../../utils/dayRemain";
import getPast15Days from "../../../utils/getPast15Days";
import CardTableTab from "../../DashboardTable/cardDateTab";
// import findDocumentById from "../../../utils/findDocumentById";

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

const main = [
  { key: "rollNumber", title: "No" },
  { key: "name", title: "Customer Name" },
  { key: "phone", title: "Phone" },
  { key: "blockHouse", title: "Block House" },
  { key: "amountBirr", title: "Amount" },
  { key: "dayRemain", title: "Day Remain" },
  { key: "remaingMoney", title: "Money Remain" },
  { key: "date", title: "Date" },
  { key: "deliveryguyName", title: "Delivery Guy Name" },
];

let CallcenterColumn = [
  ...main,
  { key: "callcenterName", title: "Callcenter Name" },
  { key: "status", title: "Status" },
];
const columns = [
  ...main,
  { key: "status", title: "Status" },
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
const CardTable = () => {
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
  const [selectedView, setSelectedView] = useState("callcenter");
  const [fromWhere, setFromWhere] = useState("edit");
  const userData = getRequiredUserData();
  // Function to handle view selection (Call Center or Branch)
  const handleViewChange = (view) => {
    console.log("view change", view);
    setSelectedView(view);
  };

  // Get an array of the past 15 days including the current date
  const past15Days = getPastDays(4);
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
    if (row.status !== "Assigned") {
      openSnackbar(
        `You can only edit new orders! This order Already ${row.status}`,
        "info"
      );
      return;
    }
    console.log("from the table", row);
    setFromWhere("edit");
    setEditRow(row);
    setIsEditDialogOpen(true);
  };
  const handleNew = (row) => {
    console.log("from the table", row);
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
      const filterField =
        selectedView === "callcenter" ? "branchId" : "callcenterId";
      console.log("filterField", filterField);
      const value =
        field == "date" ? formattedDates[selectedTab1] : selectedTab;
      console.log(field, value);
      fetchFirestoreDataWithFilter(
        "Card",
        null,
        10,
        data,
        setData,
        filterField,
        params.id,
        field,
        value
      );
      // Set the last document for pagination
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [selectedView, formattedDates[selectedTab], field, selectedTab1]);

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
        "Card",
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
        const value =
          field == "date" ? formattedDates[selectedTab1] : selectedTab;

        fetchFirestoreDataWithFilter(
          "Card",
          lastDoc,
          5,
          data,
          setData,
          filterField,
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
  }, [
    lastDoc,
    data,
    selectedView,
    formattedDates[selectedTab],
    field,
    selectedTab1,
  ]);

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

  if (userClaim.superAdmin && selectedView === "branch") {
    console.log(selectedView);
    CallcenterColumn = CallcenterColumn.filter(
      (column) => column.key !== "callcenterName"
    );
    console.log("the new column", CallcenterColumn);
  } else if (userClaim.superAdmin && selectedView !== "branch") {
    CallcenterColumn = pushOrUpdateWithKey(CallcenterColumn, {
      key: "callcenterName",
      title: "Callcenter Name",
    });
  }

  console.log("the new column", field, selectedTab1, selectedTab);

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
        title="Card Order"
        subtitle="Entire list of Card Orders"
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={CardOrderBranchForm}
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
          <ExportToExcel
            file={"Card"}
            branchId={userData.requiredId}
            id={""}
            endpoint={"card"}
            clear={true}
            name={`CardTable-Branch${userData.branchName}`}
          />
        </div>
      </div>

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
          columns={
            selectedView === "callcenter" || userClaim.superAdmin
              ? CallcenterColumn
              : columns
          }
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
