import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import { useParams } from "react-router-dom";
import ShowBudget from "../../components/Budget/ShowBudget";
import getDocumentById from "../../api/services/Status/getStatus";
import { firestore } from "../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import CreditTable from "../../components/Credit/CreditTable";
import BankTable from "../../components/Bank/table";
import useUserClaims from "../../hooks/useUserClaims";
import getRequiredUserData from "../../utils/getBranchInfo";
const Bank = () => {
  const params = useParams();
  const { user, currentUser } = useAuth();
  const userClaim = useUserClaims(user);
  const userData = getRequiredUserData();
  console.log("userData", userData);
  console.log("userClaim", userClaim.finance);
  // const { documentData } = useDocumentById("Bank", user.uid);
  const [tableDate, settableDate] = useState({});

  useEffect(() => {
    const worksRef = doc(
      collection(firestore, "Bank"),
      userClaim.finance ? user.uid : userData.requiredId
    );

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
    const worksRef = doc(
      collection(firestore, "finance"),
      userClaim.finance ? user.uid : userData.requiredId
    );

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

  console.log("tableDate", tableDate);
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Bank Transaction"
        subtitle="Entire list of Bank"
        source="finance"
      />
      <Grid container spacing={2}>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <ShowBudget
            label={"Total bank balance"}
            value={tableDate ? tableDate.total : "not available"}
            marginTop={10}
          />
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
      <Grid container spacing={2} marginTop={"10px"}>
        {financeUser.bank?.map((bankName, index) => (
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
