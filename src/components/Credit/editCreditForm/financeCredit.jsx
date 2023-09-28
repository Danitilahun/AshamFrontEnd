import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  TextField,
  MenuItem,
} from "@mui/material";
import { useParams } from "react-router-dom";
import useUserClaims from "../../../hooks/useUserClaims";
import { useFormik } from "formik";
import CustomTextField from "../component/CustomTextField";
import { useSnackbar } from "../../../contexts/InfoContext";
import { useAuth } from "../../../contexts/AuthContext";
import getInternationalDate from "../../../utils/getDate";
import LoadingSpinner from "../../VersatileComponents/LoadingSpinner";
import updateCredit from "../../../api/credit/update";
import { DailyCreditFormValidationSchema } from "../validator/dailyCreditFormValidationSchema";
import { StaffCreditFormValidationSchema } from "../validator/staffCreditFormValidationSchema";
import { firestore } from "../../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import capitalizeString from "../../../utils/capitalizeString";
const EditFinanceCreditForm = ({
  credit,
  isEditDialogOpen,
  closeEditDialog,
}) => {
  const params = useParams();
  const [showForm, setShowForm] = useState(false);
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDeliveryGuy, setSelectedDeliveryGuy] = useState("");
  const userClaims = useUserClaims(user);
  const [placementOptions, setPlacementOptions] = useState([
    "BranchAdmin",
    "Finance",
    "Callcenter",
    "SuperAdmin",
  ]);

  const [staff, setStaff] = useState([]);

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
  const formik = useFormik({
    initialValues: {
      placement: credit.placement,
      employeeName: credit.employeeName,
      employeeId: credit.employeeId,
      amount: credit.amount,
      reason: credit.reason,
    },
    validationSchema: StaffCreditFormValidationSchema,
    onSubmit: async (values) => {
      // Send formData to the backend
      setIsSubmitting(true);
      try {
        const name = capitalizeString(values.employeeName);
        values.employeeName = name;
        const date = getInternationalDate();
        values.branchId = params.id;
        values.date = date;

        console.log("values", values);
        const res = await updateCredit(
          user,
          credit.id,
          values,
          "financeCredit"
        );
        openSnackbar(`${res.data.message} successfully created!`, "success");
        handleCloseForm();
      } catch (error) {
        openSnackbar(error.message, "error");
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
    closeEditDialog();
    formik.resetForm();
  };

  return (
    <div>
      <LoadingSpinner isSubmitting={isSubmitting} />
      {userClaims.finance ? (
        <div>
          <Dialog
            open={isEditDialogOpen}
            onClose={handleCloseForm}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
              Edit StaffCredit
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

export default EditFinanceCreditForm;
