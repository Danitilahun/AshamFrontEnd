import React, { useContext, useState } from "react";
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
import CustomTextField from "../../Credit/component/CustomTextField";
import { useSnackbar } from "../../../contexts/InfoContext";
import { useAuth } from "../../../contexts/AuthContext";
import getInternationalDate from "../../../utils/getDate";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import updateCredit from "../../../api/credit/update";
import updateIncentive from "../../../api/bonusPenality/edit";
import capitalizeString from "../../../utils/capitalizeString";
import { FormValidationSchema } from "../validation/edit";

const EditForm = ({ data, isEditDialogOpen, closeEditDialog, type }) => {
  const params = useParams();
  const [showForm, setShowForm] = useState(false);
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const [selectedDeliveryGuy, setSelectedDeliveryGuy] = useState("");
  const userClaims = useUserClaims(user);

  let active = "";
  let worker = [];
  const storedData = localStorage.getItem("userData");
  if (storedData) {
    const userData = JSON.parse(storedData);
    active = userData ? userData.active : "try";
    worker = userData ? userData.worker : [];
  }

  const formik = useFormik({
    initialValues: {
      amount: data.amount,
      reason: data.reason,
    },
    validationSchema: FormValidationSchema,
    onSubmit: async (values) => {
      // Send formData to the backend
      setIsSubmitting(true);
      try {
        const date = getInternationalDate();
        values.branchId = params.id;
        values.date = date;
        values.active = active;
        values.placement = data.placement;
        values.employeeName = data.employeeName;
        values.employeeId = data.employeeId;
        values.difference = values.amount - data.amount;
        const res = await updateIncentive(data.id, user, values, type);
        openSnackbar(`${res.data.message} successfully created!`, "success");
        handleCloseForm();
      } catch (error) {
        openSnackbar(error.message, "error");
      }
      setIsSubmitting(false);
    },
  });

  const handleCloseForm = () => {
    closeEditDialog();
    formik.resetForm();
  };

  return (
    <div>
      {userClaims.admin ? (
        <div>
          <Dialog
            open={isEditDialogOpen}
            onClose={handleCloseForm}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
              Edit {type}
            </DialogTitle>
            <DialogContent
              sx={{ backgroundColor: theme.palette.background.alt }}
            >
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
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

export default EditForm;
