import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import DynamicTable from "../../DynamicTable/DynamicTable";
import { useAuth } from "../../../contexts/AuthContext";
import CardDistributeReportForm from "../createReportForm/cardDistribute";
import MyHeaderComponent from "../../VersatileComponents/MyHeaderComponent";
import fetchFirestoreDataWithFilter from "../../../api/utils/filterBasedOnTwoCriterial";
import getRequiredUserData from "../../../utils/getBranchInfo";
import Search from "../../../api/utils/searchMore";
import capitalizeString from "../../../utils/capitalizeString";
import { ExportToExcel } from "../../../utils/ExportToExcel";
import useUserClaims from "../../../hooks/useUserClaims";

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
const columns = [
  { key: "deliveryguyName", title: "Delivery Guy Name" },
  { key: "numberOfCard", title: "Number Of Card" },
  { key: "gain", title: "Gain" },
  { key: "amount", title: "Expense" },
  { key: "total", title: "Total" },
  { key: "date", title: "Date" },
  { key: "time", title: "Time" },
];

const CardDistributeTable = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const { user } = useAuth();
  const userClaim = useUserClaims(user);
  const [lastDoc, setLastDoc] = useState(null); // To keep track of the last document
  const [searchedData, setSearchedData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const branchData = getRequiredUserData();

  const handleEdit = (row) => {
    setEditRow(row);
    setIsEditDialogOpen(true);
  };

  const loadInitialData = async () => {
    try {
      fetchFirestoreDataWithFilter(
        "cardDistribute",
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
        "cardDistribute",
        null,
        1000,
        searchedData,
        setSearchedData,
        "branchId",
        params.id,
        "active",
        branchData.active,
        "deliveryguyName",
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
          "cardDistribute",
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

  const tableData = searchedData.length > 0 ? searchedData : data;
  return (
    <Box m="1rem 0">
      <MyHeaderComponent
        title="Card Distribute Report"
        subtitle="Entire list of Card Distribute Reports"
        onSearch={handleSearch}
        onCancel={handleCancel}
        formComponent={CardDistributeReportForm}
      />

      <div style={containerStyle}>
        <div style={flexItemStyle}></div>
        <div style={flexItemStyles}>
          {userClaim.superAdmin ? (
            <ExportToExcel
              file={"cardDistribute"}
              branchId={branchData.requiredId}
              id={""}
              endpoint={"cardD"}
              clear={false}
              name={`CardDistributeTable-Branch ${branchData.branchName}`}
            />
          ) : null}
        </div>
      </div>

      <DynamicTable
        data={tableData}
        columns={columns}
        loadMoreData={loadMoreData}
        onEdit={handleEdit}
        // onDelete={handleDelete}
      />
    </Box>
  );
};

export default CardDistributeTable;
