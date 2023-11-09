import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import SearchInput from "../../VersatileComponents/SearchInput";
import DynamicTable from "../../DynamicTable/DynamicTable";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import MyHeaderComponent from "../../VersatileComponents/MyHeaderComponent";
import CardFeeReportForm from "../createReportForm/cardFee";
import getRequiredUserData from "../../../utils/getBranchInfo";
import fetchFirestoreDataWithFilter from "../../../api/utils/filterBasedOnTwoCriterial";
import Search from "../../../api/utils/searchMore";
//import { SpinnerContext } from "../../../contexts/SpinnerContext";
import capitalizeString from "../../../utils/capitalizeString";
import { ExportToExcel } from "../../../utils/ExportToExcel";
import useUserClaims from "../../../hooks/useUserClaims";

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
const columns = [
  { key: "deliveryguyName", title: "Delivery Guy Name" },
  { key: "numberOfCard", title: "Number Of Card" },
  { key: "price", title: "Price" },
  { key: "date", title: "Date" },
  { key: "time", title: "Time" },
  { key: "returnCardNumber", title: "Return Card Number" },
];

const CardFeeTable = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const { user } = useAuth();
  const userClaim = useUserClaims(user);
  const [lastDoc, setLastDoc] = useState(null); // To keep track of the last document
  const [searchedData, setSearchedData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  //const {isSubmitting, setIsSubmitting} = useContext(SpinnerContext);
  //   const [deleteRowId, setDeleteRowId] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { openSnackbar } = useSnackbar();
  const branchData = getRequiredUserData();

  const handleEdit = (row) => {
    console.log("from the table", row);
    setEditRow(row);
    setIsEditDialogOpen(true);
  };

  const loadInitialData = async () => {
    try {
      fetchFirestoreDataWithFilter(
        "CardFee",
        null,
        10,
        data,
        setData,
        "branchId",
        params.id,
        "active",
        branchData.active
      );
      // Set the last document for pagination
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  console.log("data", data, params.id);
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
      const searchTextNew = capitalizeString(searchText);
      Search(
        "CardFee",
        null,
        1000,
        searchedData,
        setSearchedData,
        "branchId",
        params.id,
        "deliveryguyName",
        searchTextNew,
        "active",
        branchData.active
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
          "CardFee",
          lastDoc,
          5,
          data,
          setData,
          "branchId",
          params.id,
          "active",
          branchData.active
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
  return (
    <Box m="1rem 0">
      <MyHeaderComponent
        title="Card Fee Report"
        subtitle="Entire list of Card Fee Reports"
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={CardFeeReportForm}
      />

      <div style={containerStyle}>
        <div style={flexItemStyle}></div>
        <div style={flexItemStyles}>
          {userClaim.superAdmin ? (
            <ExportToExcel
              file={"CardFee"}
              branchId={branchData.requiredId}
              id={""}
              endpoint={"cardF"}
              clear={false}
              name={`CardFeeTable-Branch ${branchData.branchName}`}
            />
          ) : null}
        </div>
      </div>
      <DynamicTable
        data={tableData}
        columns={columns}
        loadMoreData={loadMoreData}
        onEdit={handleEdit}
      />
    </Box>
  );
};

export default CardFeeTable;
