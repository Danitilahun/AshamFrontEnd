import React, { useEffect, useState } from "react";
import { Box, Grid, useTheme } from "@mui/material";
import useDocumentById from "../../hooks/useDocumentById";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import ShowBudget from "../../components/Budget/ShowBudget";
import formatDateRange from "../../utils/formatDateRange";
import useUserClaims from "../../hooks/useUserClaims";
import { useAuth } from "../../contexts/AuthContext";
import useCollectionData from "../../hooks/useCollectionData";
import { Helmet } from "react-helmet";
const columns = [
  { key: "dayRange", title: "Date" },
  { key: "totalExpense", title: "Total Expense" },
  { key: "totalIncome", title: "Total Income" },
  { key: "totalCredit", title: "Total Credit" },
  { key: "Sheetstatus", title: "Status" },
  { key: "amount", title: "amount" },
];

const BudgetPage = () => {
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
    if (bank && totalCredit && documentData2) {
      let newRow = {};

      if (status) {
        const date = formatDateRange(status?.createdDate);
        const { id, ...restOfStatus } = status;

        newRow = {
          ...restOfStatus,
          dayRange: date,
          totalCredit: totalCredit.total,
          Sheetstatus:
            restOfStatus.totalIncome - restOfStatus.totalExpense > 0
              ? "Profit"
              : "Loss",
          amount: restOfStatus.totalIncome - restOfStatus.totalExpense,
        };
      }

      let combinedSummery = [];
      if (Object.keys(newRow).length !== 0) {
        combinedSummery = [...(documentData2?.sheetSummary ?? []), newRow];
      } else {
        combinedSummery = [...(documentData2?.sheetSummary ?? [])];
      }

      // Update the state with the combined summery
      setUpdatedSheetSummery(combinedSummery);
    }
  }, [bank, totalCredit, status, documentData2]);

  console.log("updatedSheetSummery", updatedSheetSummery);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Budget </title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="budget page" />
      </Helmet>
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
                    {console.log(
                      documentData2?.budget,
                      totalCredit?.total,
                      bank?.total,
                      status?.totalIncome,
                      status?.totalExpense
                    )}
                    <ShowBudget
                      label={"Next Budget"}
                      value={(
                        documentData2?.budget -
                        totalCredit?.total +
                        (status?.totalIncome ? status?.totalIncome : 0)
                      ).toFixed(2)}
                      // bank?.total +
                      // (status
                      //   ? status?.totalIncome - status?.totalExpense
                      //   : 0)
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

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    {console.log(
                      documentData2?.budget,
                      totalCredit?.total,
                      bank?.total,
                      status?.totalIncome,
                      status?.totalExpense
                    )}
                    <ShowBudget
                      label={"Total Expense"}
                      value={documentData2 ? documentData2?.total : 0}
                      marginTop={10}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    {/* <ShowBudget
                      label={"Bank Balance"}
                      value={bank?.total}
                      marginTop={10}
                    /> */}
                  </Grid>
                </Grid>
              </>
            )}
            {userClaims.finance && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <ShowBudget
                      label={"Total Status"}
                      value={documentData2.total}
                      marginTop={10}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    {/* <ShowBudget
                      label={"Next Budget"}
                      value={
                        parseFloat(finance.budget) +
                        parseFloat(totalFromAllBranch)
                      }
                      marginTop={10}
                    /> */}
                  </Grid>
                </Grid>
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
};

export default BudgetPage;
