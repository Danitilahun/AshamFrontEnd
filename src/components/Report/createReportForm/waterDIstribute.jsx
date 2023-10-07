import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import useUserClaims from "../../../hooks/useUserClaims";
import { useFormik } from "formik";
import CustomTextField from "../component/CustomTextField";
import { useSnackbar } from "../../../contexts/InfoContext";
import { useAuth } from "../../../contexts/AuthContext";
import getInternationalDate from "../../../utils/getDate";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import getCurrentTime from "../../../utils/getCurrentTime";
import createReport from "../../../api/report/createReport";
import { ReportFormValidationSchema } from "../validator/ReportFormValidationSchema";
import capitalizeString from "../../../utils/capitalizeString";

const WaterDistributeReportForm = () => {
  const params = useParams();
  const [showForm, setShowForm] = useState(false);
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const userClaims = useUserClaims(user);
  const [selectedDeliveryGuy, setSelectedDeliveryGuy] = useState("");

  let active = "";
  let activeTable = "";
  let activeDailySummery = "";
  let worker = [];
  const storedData = localStorage.getItem("userData");
  if (storedData) {
    const userData = JSON.parse(storedData);
    active = userData ? userData.active : "";
    worker = userData ? userData.worker : [];
    activeTable = userData ? userData.activeTable : "";
    activeDailySummery = userData ? userData.activeDailySummery : "";
  }

  let filteredData = worker?.filter((item) => item.role === "DeliveryGuy");
  let transformedData = filteredData?.map((item) => [item.name, item.id]);

  const [countdown, setCountdown] = useState(null);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  useEffect(() => {
    if (!active) {
      openSnackbar(
        `There is not salary table for this branch, please create one first!`,
        "info"
      );
    }
  }, []);

  useEffect(() => {
    if (!activeTable) {
      openSnackbar(
        `You do not have daily table.Please create one first!`,
        "info"
      );
    }
  }, []);

  const handleButtonClick = () => {
    // Reset the form submission state when button is clicked
    if (active && activeTable) {
      setIsFormSubmitted(false);
      if (!isCountdownActive && !isFormSubmitted) {
        setShowForm(true);
      }
    } else {
      if (!active) {
        openSnackbar(
          `There is not salary table for this branch, please create one first!`,
          "info"
        );
      }
      if (!activeTable) {
        openSnackbar(
          `You do not have table for this branch, please create one first!`,
          "info"
        );
      }
    }
  };

  const startCountdown = () => {
    if (!isCountdownActive && !isFormSubmitted) {
      setIsCountdownActive(true); // Start countdown
      setCountdown(10); // Set the countdown time (e.g., 10 seconds)
    }
  };

  const handleUndo = () => {
    setIsCountdownActive(false); // Reset the countdown
    setCountdown(null);
  };

  const handleDeliveryGuyChange = (event) => {
    setSelectedDeliveryGuy(event.target.value);
    const Id = event.target.value;
    const Name =
      transformedData.find((employee) => employee[1] === Id)?.[0] || "";
    formik.setFieldValue("deliveryguyName", Name);
    formik.setFieldValue("deliveryguyId", Id);
  };
  const formik = useFormik({
    initialValues: {
      deliveryguyName: "",
      deliveryguyId: "",
      numberOfCard: "",
    },
    validationSchema: ReportFormValidationSchema,
    onSubmit: async (values) => {
      // Send formData to the backend
      setIsSubmitting(true);
      try {
        const name = capitalizeString(values.deliveryguyName);
        values.deliveryguyName = name;
        const currentTimeString = getCurrentTime();
        const date = getInternationalDate();
        values.time = currentTimeString;
        values.branchId = params.id;
        values.date = date;
        values.active = active;
        values.activeTable = activeTable;
        values.activeDailySummery = activeDailySummery;
        console.log("values", values);
        const res = await createReport(user, values, "waterDistribute");
        openSnackbar(`${res.data.message} successfully created!`, "success");
        handleCloseForm();
        setTimeout(() => {
          setIsFormSubmitted(false);
          setIsSubmitting(false);
        }, 1000);
      } catch (error) {
        if (error.response && error.response.data) {
          openSnackbar(
            error.response.data.message,
            error.response.data.type ? error.response.data.type : "error"
          );
        } else {
          openSnackbar("An unexpected error occurred.", "error");
        }
      }
      setIsSubmitting(false);
    },
  });

  const handleCloseForm = () => {
    setShowForm(false);
    formik.resetForm();
  };

  useEffect(() => {
    let timer;
    if (isCountdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && isCountdownActive) {
      setIsCountdownActive(false); // stop the countdown
      if (!isFormSubmitted) {
        formik.handleSubmit(); // Submit the form only if not already submitted
      }
    }
    return () => clearTimeout(timer); // clear the timer
  }, [countdown, formik, isCountdownActive, isFormSubmitted]);

  useEffect(() => {
    // After form submission, reset the form and clear the countdown
    if (isFormSubmitted) {
      formik.resetForm();
      setIsCountdownActive(false);
      setCountdown(null);
      setIsFormSubmitted(false);
    }
  }, [isFormSubmitted, formik]);

  return (
    <div>
      {userClaims.admin ? (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
            disabled={isCountdownActive || isFormSubmitted}
          >
            Create New Water Distribute
          </Button>

          <Dialog
            open={showForm}
            onClose={handleCloseForm}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
              New Water Distribute
            </DialogTitle>
            <DialogContent
              sx={{ backgroundColor: theme.palette.background.alt }}
            >
              {isCountdownActive ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                    }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={(countdown / 10) * 100}
                      color="secondary"
                    />
                    <Typography
                      variant="body1"
                      color="green"
                      style={{
                        position: "absolute",
                        top: "45%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1,
                      }}
                    >
                      {countdown}
                    </Typography>
                  </div>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    style={{ marginTop: "8px" }}
                  >
                    Are you sure you order {formik.values.deliveryguyName} to
                    distribute {formik.values.numberOfCard} water bill?
                  </Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleUndo}
                    style={{ marginTop: "16px" }}
                  >
                    Undo
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    startCountdown();
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <TextField
                        select
                        name="deliveryguyId"
                        variant="outlined"
                        fullWidth
                        required
                        value={formik.values.deliveryguyId}
                        onChange={handleDeliveryGuyChange}
                        onBlur={formik.handleBlur} // <-- Add this line
                        label="Delivery Guy"
                        InputLabelProps={{
                          shrink: true,
                          style: {
                            marginTop: "8px",
                            color: theme.palette.secondary[100],
                          },
                        }}
                        SelectProps={{
                          MenuProps: {
                            PaperProps: {
                              style: {
                                backgroundColor: theme.palette.background.alt,
                                color: "inherit",
                              },
                            },
                          },
                        }}
                        error={
                          formik.touched.deliveryguyId &&
                          Boolean(formik.errors.deliveryguyId)
                        }
                        helperText={
                          formik.touched.deliveryguyId &&
                          formik.errors.deliveryguyId
                        }
                      >
                        <MenuItem value="">Select Delivery Guy</MenuItem>
                        {transformedData?.map((branch) => (
                          <MenuItem key={branch[1]} value={branch[1]}>
                            {branch[0]}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <CustomTextField
                      name="numberOfCard" // Use lowercase field name
                      label="Number Of Card" // Use lowercase field name
                      value={formik.values.numberOfCard}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur} // <-- Add this line
                      errors={formik.errors}
                      touched={formik.touched}
                      type="number"
                    />

                    <Grid
                      item
                      xs={12}
                      container
                      alignItems="end"
                      justifyContent="end"
                    >
                      <DialogActions
                        sx={{ backgroundColor: theme.palette.background.alt }}
                      >
                        <Button
                          variant="contained"
                          onClick={handleCloseForm}
                          color="secondary"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          Submit
                        </Button>
                      </DialogActions>
                    </Grid>
                  </Grid>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default WaterDistributeReportForm;
