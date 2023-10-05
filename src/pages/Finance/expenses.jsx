import React, { useEffect, useState } from "react";
import { Box, Grid, useTheme } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import Calculator from "../../components/VersatileComponents/financeCalculator";
import { useParams } from "react-router-dom";
import { firestore } from "../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import ShowBudget from "../../components/Budget/ShowBudget";
import ExpenseTable from "../../components/Expense/table";
import { Helmet } from "react-helmet";
const Expenses = () => {
  const params = useParams();
  const theme = useTheme();
  const [financeUser, setFinanceUser] = useState({});
  useEffect(() => {
    const worksRef = doc(collection(firestore, "finance"), params.id);

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
  }, [params.id]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title> Expense </title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of expense" />
      </Helmet>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100%",
          position: "relative",
        }}
      >
        <Header title="Expense" subtitle="Entire list of Expense" />
        <Grid container spacing={2}>
          <Grid item xs={6} sx={{ mt: 3 }}>
            <ExpenseTable />
            <ShowBudget
              label={"Total Expense"}
              value={financeUser ? financeUser.totalExpense : "not available"}
              marginTop={10}
            />
          </Grid>

          <Grid item xs={6}>
            <Calculator
              Expenses={financeUser.totalExpense ? financeUser.totalExpense : 0}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Expenses;
