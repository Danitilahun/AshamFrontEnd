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
import { StaffCreditFormValidationSchema } from "../validator/staffCreditFormValidationSchema";
import fetchData from "../../../api/services/Users/getUser";
import useDocumentById from "../../../hooks/useDocumentById";
import { firestore } from "../../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import capitalizeString from "../../../utils/capitalizeString";
const FinancialCreditForm = ({ type }) => {
  const params = useParams();
  const [showForm, setShowForm] = useState(false);
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const userClaims = useUserClaims(user);
  const [selectedDeliveryGuy, setSelectedDeliveryGuy] = useState("");
  const [staff, setStaff] = useState({});
  const [placementOptions, setPlacementOptions] = useState([
    "BranchAdmin",
    "Finance",
    "Callcenter",
    "SuperAdmin",
  ]);

  useEffect(() => {
    const worksRef = doc(collection(firestore, "ashamStaff"), "ashamStaff");
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(worksRef, (doc) => {
      if (doc.exists()) {
        setStaff(doc.data());
      }
    });
    return () => unsubscribe();
  }, []);
  const handleButtonClick = () => {
    setShowForm(true);
  };
  const formik = useFormik({
    initialValues: {
      placement: "",
      employeeName: "",
      employeeId: "",
      amount: "",
      reason: "",
    },

    validationSchema: StaffCreditFormValidationSchema,
    onSubmit: async (values) => {
      // Send formData to the backend
      setIsSubmitting(true);
      try {
        const name = capitalizeString(values.employeeName);
        values.employeeName = name;
        const date = getInternationalDate();
        values.branchId = params.id ? params.id : user.uid;
        values.date = date;
        const res = await createCredit(user, values, "financeCredit");
        openSnackbar(`${res.data.message} successfully created!`, "success");
        handleCloseForm();
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

  let filteredData = staff?.member?.filter(
    (item) => item.role === formik.values.placement
  );

  let transformedData = filteredData?.map((item) => [item.name, item.id]);

  const handleDeliveryGuyChange = (event) => {
    setSelectedDeliveryGuy(event.target.value);
    const Id = event.target.value;
    const Name =
      transformedData.find((employee) => employee[1] === Id)?.[0] || "";
    formik.setFieldValue("employeeName", Name);
    formik.setFieldValue("employeeId", Id);
  };
  const handleCloseForm = () => {
    setShowForm(false);
    formik.resetForm();
  };

  return (
    <div>
      {userClaims.finance ? (
        <div>
          {userClaims.finance ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleButtonClick}
            >
              Create New Financial credit
            </Button>
          ) : null}

          <Dialog
            open={showForm}
            onClose={handleCloseForm}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
              New Finance Credit
            </DialogTitle>
            <DialogContent
              sx={{ backgroundColor: theme.palette.background.alt }}
            >
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <TextField
                      select
                      name="placement"
                      label="Placement"
                      required
                      value={formik.values.placement}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      fullWidth
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
                    >
                      <MenuItem value="">Select Placement</MenuItem>
                      {placementOptions.map((placement) => (
                        <MenuItem key={placement} value={placement}>
                          {placement}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <TextField
                      select
                      name="employeeId"
                      variant="outlined"
                      fullWidth
                      required
                      value={formik.values.employeeId}
                      onChange={handleDeliveryGuyChange}
                      onBlur={formik.handleBlur} // <-- Add this line
                      label={
                        formik.values.placement
                          ? formik.values.placement
                          : "Employee"
                      }
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
                        formik.touched.employeeId &&
                        Boolean(formik.errors.employeeId)
                      }
                      helperText={
                        formik.touched.employeeId && formik.errors.employeeId
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

export default FinancialCreditForm;
