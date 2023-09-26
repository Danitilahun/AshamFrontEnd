import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import { useParams } from "react-router-dom";
import useDocumentById from "../../hooks/useDocumentById";
import ShowBudget from "../../components/Budget/ShowBudget";
import BankTable from "../../components/Bank/table";
import getRequiredUserData from "../../utils/getBranchInfo";
import BankForm from "../../components/Bank/createBankForm";
import useUserClaims from "../../hooks/useUserClaims";
import { useAuth } from "../../contexts/AuthContext";

const Bank = () => {
  const params = useParams();
  const theme = useTheme();
  const branchData = getRequiredUserData();
  let bank = branchData?.bank ? branchData?.bank : [];
  const { documentData } = useDocumentById("Bank", params.id);
  const { user } = useAuth();
  const userClaims = useUserClaims(user);

  return (
    <Box
      m="1.5rem 2.5rem"
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100%",
        position: "relative",
      }}
    >
      {/* <Header
        title="Bank Transaction"
        subtitle="Entire list of Bank"
        source="branches"
      /> */}

      <Grid container spacing={2}>
        <Grid
          item
          xs={userClaims.superAdmin ? 6 : 4}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <Box flex="1">
            <Typography
              variant="h2"
              color={theme.palette.secondary[100]}
              fontWeight="bold"
              sx={{ mb: "5px" }}
            >
              Bank Transaction
            </Typography>

            <Typography variant="h5" color={theme.palette.secondary[300]}>
              Entire list of Bank Transactions
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={userClaims.superAdmin ? 6 : 5}
          sx={{
            display: "flex",
            justifyContent: userClaims.superAdmin ? "flex-end" : "center",
            alignItems: userClaims.superAdmin ? "flex-end" : "center",
          }}
        >
          <ShowBudget
            label={"Total bank balance"}
            value={documentData?.total}
            marginTop={0}
          />
        </Grid>
        <Grid
          item
          xs={userClaims.superAdmin ? 0 : 3}
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <BankForm source="branches" />
        </Grid>
      </Grid>
      {/* <Grid container spacing={2}>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <ShowBudget
            label={"Total bank balance"}
            value={documentData?.total}
            marginTop={10}
          />
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid> */}
      <Grid container spacing={2} marginTop={"10px"}>
        {bank?.map((bankName, index) => (
          <Grid item xs={6} key={index}>
            <Typography variant="h6" fontWeight="bold" fontSize={"24px"}>
              {bankName}
            </Typography>
            <BankTable bankName={bankName} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Bank;
