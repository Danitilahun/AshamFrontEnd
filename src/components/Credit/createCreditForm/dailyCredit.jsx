import React, { useContext, useState } from "react";
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
} from "@mui/material";
import { useParams } from "react-router-dom";
import useUserClaims from "../../../hooks/useUserClaims";
import { useFormik } from "formik";
import CustomTextField from "../component/CustomTextField";
import { useSnackbar } from "../../../contexts/InfoContext";
import { useAuth } from "../../../contexts/AuthContext";
import getInternationalDate from "../../../utils/getDate";
import createCredit from "../../../api/credit/create";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import { DailyCreditFormValidationSchema } from "../validator/dailyCreditFormValidationSchema";
import getRequiredUserData from "../../../utils/getBranchInfo";
import capitalizeString from "../../../utils/capitalizeString";

const DailyCreditForm = ({ type }) => {
  const params = useParams();
  const [showForm, setShowForm] = useState(false);
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();
  const { setIsSubmitting } = useContext(SpinnerContext);
  const userClaims = useUserClaims(user);
  const userData = getRequiredUserData();
  let active = "";
  let worker = [];
  const storedData = localStorage.getItem("userData");
  if (storedData) {
    const userData = JSON.parse(storedData);
    active = userData ? userData.active : "";
    worker = userData ? userData.worker : [];
  }

  const handleButtonClick = () => {
    if (active) {
      setShowForm(true);
    } else {
      openSnackbar(
        `There is not salary table for this branch, please create one first!`,
        "info"
      );
    }
  };

  let filteredData = worker?.filter((item) => item.role === "DeliveryGuy");
  let transformedData = filteredData?.map((item) => [item.name, item.id]);
  const handleDeliveryGuyChange = (event) => {
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
      amount: "",
      reason: "",
    },
    validationSchema: DailyCreditFormValidationSchema,
    onSubmit: async (values) => {
      // Send formData to the backend
      setIsSubmitting(true);
      try {
        const date = getInternationalDate();
        values.branchId = params.id
          ? params.id
          : user.displayName
          ? user.displayName
          : userData.requiredId;

        if (!values.branchId) {
          handleCloseForm();
          throw {
            response: {
              data: {
                message:
                  "Branch information is not found. Please check your connection, refresh your browser, and try again.",
                type: "error",
              },
            },
          };
        }
        values.date = date;
        values.gain = values.amount;
        values.type = type;
        values.active = active;

        if (!values.active) {
          handleCloseForm();
          throw {
            response: {
              data: {
                message:
                  "To create new daily credit, ensure you have the calculator available. If not, check your internet connection, refresh your browser, and try again.",
                type: "info",
              },
            },
          };
        }
        const name = capitalizeString(values.deliveryguyName);
        values.deliveryguyName = name;
        const res = await createCredit(user, values, "DailyCredit");
        openSnackbar(`${res.data.message} successfully created!`, "success");
        handleCloseForm();
      } catch (error) {
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
      setIsSubmitting(false);
    },
  });

  const handleCloseForm = () => {
    setShowForm(false);
    formik.resetForm();
  };

  return (
    <div>
      {userClaims.admin ? (
        <div>
          {userClaims.admin ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleButtonClick}
            >
              Create New Daily Credit
            </Button>
          ) : null}

          <Dialog
            open={showForm}
            onClose={handleCloseForm}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
              New Daily Credit
            </DialogTitle>
            <DialogContent
              sx={{ backgroundColor: theme.palette.background.alt }}
            >
              <form onSubmit={formik.handleSubmit}>
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
                    name="reason" // Use lowercase field name
                    label="Reason" // Use lowercase field name
                    value={formik.values.reason}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} // <-- Add this line
                    errors={formik.errors}
                    touched={formik.touched}
                  />

                  <CustomTextField
                    name="amount" // Use lowercase field name
                    label="Amount" // Use lowercase field name
                    value={formik.values.amount}
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
                      <Button type="submit" variant="contained" color="primary">
                        Submit
                      </Button>
                    </DialogActions>
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default DailyCreditForm;
