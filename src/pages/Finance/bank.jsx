import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import ShowBudget from "../../components/Budget/ShowBudget";
import { firestore } from "../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import BankTable from "../../components/Bank/table";
import useUserClaims from "../../hooks/useUserClaims";
import getRequiredUserData from "../../utils/getBranchInfo";
import BankForm from "../../components/Bank/createBankForm";
import { Helmet } from "react-helmet";

const Bank = () => {
  const { user } = useAuth();
  const params = useParams();
  const userClaim = useUserClaims(user);
  const userData = getRequiredUserData();
  const theme = useTheme();
  const userClaims = useUserClaims(user);

  const [tableDate, settableDate] = useState({});

  useEffect(() => {
    const docId = userClaim.finance
      ? user.uid
      : userData.requiredId
      ? userData.requiredId
      : params.id; // Set the document ID
    if (!docId) return;
    const worksRef = doc(collection(firestore, "Bank"), docId);

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(worksRef, (doc) => {
      if (doc.exists()) {
        settableDate(doc.data());
      } else {
        settableDate([]);
      }
    });
    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [userClaim.finance ? user.uid : userData.requiredId]);

  const [financeUser, setFinanceUser] = useState({});
  useEffect(() => {
    const docId = userClaim.finance
      ? user.uid
      : userData.requiredId
      ? userData.requiredId
      : params.id; // Set the document ID
    if (!docId) {
      return;
    }

    const worksRef = doc(collection(firestore, "finance"), docId);

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(worksRef, (doc) => {
      if (doc.exists()) {
        setFinanceUser(doc.data());
      } else {
        setFinanceUser({});
      }
    });
    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [userClaim.finance ? user.uid : userData.requiredId]);

  console.log("financeUser", financeUser);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title> Bank </title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of bank transactions" />
      </Helmet>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100%",
          position: "relative",
        }}
      >
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
              value={tableDate ? tableDate.total : "not available"}
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
            <BankForm source="finance" />
          </Grid>
        </Grid>

        <Grid container spacing={2} marginTop={"10px"}>
          {financeUser.bank?.map((bankName, index) => (
            <Grid item xs={6} key={index}>
              <Typography variant="h6" fontWeight="bold" fontSize={"24px"}>
                {bankName}
              </Typography>
              <BankTable bankName={bankName} />
              <ShowBudget
                label={"Balance"}
                value={
                  tableDate && tableDate[bankName]
                    ? tableDate[bankName]
                    : "not available"
                }
                marginTop={0}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Bank;
