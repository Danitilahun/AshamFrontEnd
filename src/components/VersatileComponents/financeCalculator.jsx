import React, { useContext, useEffect, useState } from "react";
import { Grid, Paper, TextField, Typography, useTheme } from "@mui/material";
import getData from "../../api/services/DeliveryGuy/getDeliveryGuy";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/InfoContext";
import LoadingSpinner from "./LoadingSpinner";
import { useLocation, useParams } from "react-router-dom";
import updateCalculator from "../../api/calculator/updateCalculator";
import getRequiredUserData from "../../utils/getBranchInfo";
import useUserClaims from "../../hooks/useUserClaims";
import { SpinnerContext } from "../../contexts/SpinnerContext";
import { firestore } from "../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";

const initialValues = {
  200: 0,
  100: 0,
  50: 0,
  10: 0,
  5: 0,
  1: 0,
};

const updateFields = (targetObject, sourceObject) => {
  for (const key in sourceObject) {
    if (key in targetObject) {
      targetObject[key] = sourceObject[key];
    }
  }
};

const Calculator = ({ Expenses }) => {
  const theme = useTheme();
  const params = useParams();
  const { user } = useAuth();
  const userClaim = useUserClaims(user);
  const userData = getRequiredUserData();
  const [data, setData] = useState({});
  const userClaims = useUserClaims(user);
  const { openSnackbar } = useSnackbar();
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const [calculator, setCalculator] = useState({
    sum: 0,
    actual: 0,
    balance: 0,
  });

  const [finance, setFinance] = useState({});

  useEffect(() => {
    if (!userClaims.finance || !user || !user.uid) {
      return; // Add a check for user and user.uid
    }

    const worksRef = doc(collection(firestore, "finance"), user.uid);

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(worksRef, (doc) => {
      if (doc.exists()) {
        if (doc.data().disable) {
          setFinance(doc.data());
        }
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [user.uid]);

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

  useEffect(() => {
    if (!user || !user.uid) {
      return;
    }

    const docId = userClaim.finance
      ? user.uid
      : userData.requiredId
      ? userData.requiredId
      : params.id; // Set the document ID
    const unsubscribe = getData("Calculator", "active", docId, setCalculator);
    if (!calculator) {
      setCalculator({
        sum: 0,
        actual: 0,
        balance: 0,
      });
    }
    return () => unsubscribe();
  }, [user]);

  updateFields(initialValues, calculator);
  useEffect(() => {
    // Simulating fetching data from an API
    setData(initialValues);
  }, []);

  const handleInputChange = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleKeyPress = async (key) => {
    setIsSubmitting(true);
    if (data[key] === "") {
      openSnackbar(`${key} value can not be null.`, "info");
      handleInputChange(key, 0);
      setIsSubmitting(false);
      return;
    }
    try {
      const value = {
        [key]: Math.abs(parseInt(data[key])),
      };

      if (!user || !user.uid) {
        throw {
          response: {
            data: {
              message:
                "Calculator information is not found. Please check your connection, refresh your browser, and try again.",
              type: "error",
            },
          },
        };
      }
      const res = await updateCalculator(user, user.uid, value);
      openSnackbar(`${res.data.message}`, "success");
    } catch (error) {
      if (error.response && error.response.data) {
        openSnackbar(
          error.response.data.message,
          error.response.data.type ? error.response.data.type : "error"
        );
      } else {
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
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Paper
        elevation={5}
        style={{
          padding: "20px 50px",
          margin: "20px",
          marginTop: "45px",
          backgroundColor: theme.palette.background.alt,
          color: theme.palette.secondary[300],
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          align="left"
          style={{ fontWeight: "bold", marginBottom: "20px" }}
        >
          Calculator
        </Typography>
        <Grid container spacing={2}>
          {Object.keys(data).map((key) => (
            <Grid item xs={6} key={key}>
              <Typography variant="subtitle1" align="left">
                {key} Birr
              </Typography>
              <TextField
                value={data[key]}
                type="number"
                onChange={(e) => handleInputChange(key, e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleKeyPress(key);
                  }
                }}
                disabled={userClaims.superAdmin}
                fullWidth
                sx={{
                  "& input": {
                    textAlign: "center",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
        <Grid
          container
          spacing={2}
          style={{ marginTop: "20px", marginLeft: "30%" }}
        >
          <Grid item xs={4}>
            <Typography variant="subtitle1" align="left">
              Sum
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" align="left">
              Actual
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" align="left">
              Balance
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" align="left">
              {calculator ? calculator?.sum?.toFixed(2) : 0}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" align="left">
              {calculator && financeUser
                ? (
                    parseFloat(financeUser?.budget) +
                    calculator?.actual -
                    (Expenses ? Expenses : 0)
                  )?.toFixed(2)
                : 0}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" align="left">
              {calculator &&
                financeUser &&
                (
                  calculator?.balance?.toFixed(2) -
                  parseFloat(financeUser?.budget)?.toFixed(2)
                )?.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default Calculator;
