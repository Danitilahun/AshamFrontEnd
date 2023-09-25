import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, useTheme } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import Calculator from "../../components/VersatileComponents/MoneyNoteCalculator";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import { useParams } from "react-router-dom";
import loadDataFromFirestore from "../../api/utils/loadDataFromFirestore";
import { useAuth } from "../../contexts/AuthContext";
import { firestore } from "../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import ShowBudget from "../../components/Budget/ShowBudget";
import ExpenseTable from "../../components/Expense/table";

const Expenses = () => {
  const { user } = useAuth();
  const params = useParams();
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
  console.log("finance", financeUser);
  return (
    <Box m="1.5rem 2.5rem">
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
          <Calculator />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Expenses;
