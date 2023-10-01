import React, { useContext, useEffect, useState } from "react";
import { Box, Grid, useTheme } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import getHumanReadableDate from "../../utils/humanReadableDate";
import CustomInfoRow from "../../components/CustomComponents/CustomInfoRow";
import useDocumentById from "../../hooks/useDocumentById";
import BudgetHeader from "../../components/Budget/BudgetHeader";
import TransactionTable from "../../components/Budget/TransactionTable";
import BudgetSummary from "../../components/Budget/BudgetSummary";
import BankSummary from "../../components/Budget/BankSummary";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import ShowBudget from "../../components/Budget/ShowBudget";
import { useParams } from "react-router-dom";
import calculateDayDifference from "../../utils/calculateDayDifference";
import formatDateRange from "../../utils/formatDateRange";
import useUserClaims from "../../hooks/useUserClaims";
import { useAuth } from "../../contexts/AuthContext";
import useCollectionData from "../../hooks/useCollectionData";

const columns = [
  { key: "dayRange", title: "Date" },
  { key: "totalExpense", title: "Total Expense" },
  { key: "totalIncome", title: "Total Income" },
  { key: "totalCredit", title: "Total Credit" },
  { key: "Sheetstatus", title: "Status" },
  { key: "amount", title: "amount" },
];

const BudgetPage = () => {
  const params = useParams();
  const theme = useTheme();
  const storedData = localStorage.getItem("userData");
  let openingDate = "";
  let active = "";
  let branchId = "";
  if (storedData) {
    const userData = JSON.parse(storedData);
    active = userData ? userData.active : "try";
    branchId = userData ? userData.id : "try";
    openingDate = userData ? userData.openingDate : "try";
  }

  if (!active) {
    const storedData2 = localStorage.getItem("active");
    if (storedData2) {
      const userData = JSON.parse(storedData2);
      active = userData ? userData.active : "try";
    }
  }

  // const { documentData } = useDocumentById("Bank", branchId);
  const { user } = useAuth();
  const userClaims = useUserClaims(user);
  const { documentData: documentData2 } = useDocumentById("Budget", branchId);
  const { documentData: finance } = useDocumentById("finance", user.uid);
  const { documentData: status } = useDocumentById(
    "Status",
    active ? active : branchId
  );
  const { data: AllBranch } = useCollectionData("Budget");
  const { documentData: totalCredit } = useDocumentById(
    "totalCredit",
    branchId
  );
  const { documentData: bank } = useDocumentById("Bank", branchId);

  // const date = getHumanReadableDate(openingDate);
  // const Data = documentData2 ? documentData2.sheetSummery : [];

  const [updatedSheetSummery, setUpdatedSheetSummery] = useState([]);
  const [totalFromAllBranch, setTotalFromAllBranch] = useState(0);
  useEffect(() => {
    if (AllBranch && AllBranch.length > 0) {
      // Calculate the sum of "total" values from the AllBranch array
      const sumFromAllBranch = AllBranch?.reduce((accumulator, branch) => {
        return accumulator + (branch.total || 0); // Use 0 as the default value if 'total' is undefined
      }, 0);

      // Set the sum in state
      setTotalFromAllBranch(sumFromAllBranch);
    }
    // Calculate the sum and update updatedSheetSummery when bank, totalCredit, or status changes
    if (
      status?.totalIncome !== undefined &&
      bank &&
      totalCredit &&
      status &&
      documentData2
    ) {
      // console.log("banksdkfjnsdf", bank);
      // Create the new row with the calculated sum
      const date = formatDateRange(status.createdDate);
      const { id, ...restOfStatus } = status;

      const newRow = {
        ...restOfStatus,
        dayRange: date,
        totalCredit: totalCredit.total,
        Sheetstatus:
          restOfStatus.totalIncome - restOfStatus.totalExpense > 0
            ? "Profit"
            : "Loss",
        amount: restOfStatus.totalIncome - restOfStatus.totalExpense,
      };

      console.log(documentData2?.sheetSummary);
      // Combine the contents of documentData2.sheetSummery and newRow
      const combinedSummery = [...(documentData2?.sheetSummary ?? []), newRow];

      // Update the state with the combined summery
      setUpdatedSheetSummery(combinedSummery);
    }
  }, [bank, totalCredit, status, documentData2]);
  console.log("updatedSheetSummery", updatedSheetSummery);
  return (
    <Box
      m="1.5rem 2.5rem"
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100%",
        position: "relative",
      }}
    >
      {documentData2 ? (
        <>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <ShowBudget
                label={"Total Budget"}
                value={
                  userClaims.finance ? finance.budget : documentData2.budget
                }
                marginTop={10}
              />
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid>

          <DynamicTable
            data={updatedSheetSummery}
            columns={columns}
            // loadMoreData={loadMoreData}
          />

          {!userClaims.finance && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <ShowBudget
                    label={"Final Budget"}
                    value={documentData2?.budget}
                    marginTop={10}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ShowBudget
                    label={"All Credit"}
                    value={totalCredit?.total}
                    marginTop={10}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <ShowBudget
                    label={"Next Budget"}
                    value={
                      documentData2?.budget - totalCredit?.total - bank?.total
                    }
                    marginTop={10}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ShowBudget
                    label={"Bank Balance"}
                    value={bank?.total}
                    marginTop={10}
                  />
                </Grid>
              </Grid>
            </>
          )}
          {userClaims.finance && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ShowBudget
                    label={"Total Status"}
                    value={documentData2.total}
                    marginTop={10}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ShowBudget
                    label={"Next Budget"}
                    value={finance.budget - totalFromAllBranch}
                    marginTop={10}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default BudgetPage;
