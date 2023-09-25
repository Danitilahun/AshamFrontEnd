import React, { useEffect, useState } from "react";
import { Grid, Paper, TextField, Typography, useTheme } from "@mui/material";
import getData from "../../api/services/DeliveryGuy/getDeliveryGuy";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/InfoContext";
import LoadingSpinner from "./LoadingSpinner";
import { useLocation } from "react-router-dom";
import updateCalculator from "../../api/calculator/updateCalculator";
import getRequiredUserData from "../../utils/getBranchInfo";
import useUserClaims from "../../hooks/useUserClaims";

const initialValues = {
  200: 0,
  100: 0,
  50: 0,
  10: 0,
  5: 0,
  1: 0,
};

const updateFields = (targetObject, sourceObject) => {
  // Loop through the keys in the source object
  for (const key in sourceObject) {
    // Check if the key exists in both objects
    if (key in targetObject) {
      // Update the value in the target object
      targetObject[key] = sourceObject[key];
    }
  }
};

const Calculator = () => {
  const theme = useTheme();
  const [data, setData] = useState({});
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userClaims, setUserClaims] = useState({});
  const userData = getRequiredUserData();
  useEffect(() => {
    async function fetchUserClaims() {
      try {
        const idTokenResult = await user.getIdTokenResult();
        setUserClaims(idTokenResult.claims);
      } catch (error) {
        console.log("Error fetching user claims:", error);
      }
    }
    fetchUserClaims();
  }, [user]);

  let active = userData.active;

  const [calculator, setCalculator] = useState({
    sum: 0,
    actual: 0,
    balance: 0,
  });

  useEffect(() => {
    if (!active) {
      return;
    }
    const unsubscribe = getData("Calculator", "active", active, setCalculator);
    if (!calculator) {
      console.log("the calculator is", calculator);
      setCalculator({
        sum: 0,
        actual: 0,
        balance: 0,
      });
    }
    return () => unsubscribe();
  }, []);

  updateFields(initialValues, calculator);
  console.log("the calculator value is", calculator);
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
    if (active === "") {
      openSnackbar(`You do not have a sheet. Create sheet before.`, "info");
      handleInputChange(key, 0);
      setIsSubmitting(false);
      return;
    }
    try {
      const value = {
        [key]: parseInt(data[key]),
      };
      console.log("the value is", value);
      const res = await updateCalculator(user, active, value);
      openSnackbar(`${res.data.message}`, "success");
    } catch (error) {
      openSnackbar(
        error.response.data.message,
        error.response.data.type ? error.response.data.type : "error"
      );
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    console.log("in the use effect", active);
    if (!active) {
      openSnackbar(
        `You do not have calculator , Since you do not have active sheet, please create one first!`,
        "info"
      );
    }
  }, [active]);

  return (
    <>
      <LoadingSpinner isSubmitting={isSubmitting} />
      {active && (
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
                  fullWidth
                  disabled={userClaims.superAdmin}
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
                {calculator ? calculator.sum : 0}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle1" align="left">
                {calculator ? calculator.actual : 0}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle1" align="left">
                {calculator ? calculator.balance : 0}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </>
  );
};

export default Calculator;
