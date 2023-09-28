import React, { useState } from "react";
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";
import { useParams } from "react-router-dom";
import useUserClaims from "../../../hooks/useUserClaims";
import { useFormik } from "formik";
import CustomTextField from "../component/CustomTextField";
import { useSnackbar } from "../../../contexts/InfoContext";
import { useAuth } from "../../../contexts/AuthContext";
import getInternationalDate from "../../../utils/getDate";
import createCredit from "../../../api/credit/create";
import LoadingSpinner from "../../VersatileComponents/LoadingSpinner";
import { CustomerCreditFormValidationSchema } from "../validator/customerCreditValidator";
import updateCredit from "../../../api/credit/update";
import capitalizeString from "../../../utils/capitalizeString";

const EditCustomerCreditForm = ({
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
  const userClaims = useUserClaims(user);
  let active = "";
  const storedData = localStorage.getItem("userData");
  if (storedData) {
    const userData = JSON.parse(storedData);
    active = userData ? userData.active : "try";
  }

  const formik = useFormik({
    initialValues: {
      name: credit.name,
      amount: credit.amount,
      reason: credit.reason,
      address: credit.address,
      phone: credit.phone,
    },
    validationSchema: CustomerCreditFormValidationSchema,
    onSubmit: async (values) => {
      // Send formData to the backend
      setIsSubmitting(true);
      try {
        const name = capitalizeString(values.name);
        values.name = name;
        const date = getInternationalDate();
        values.branchId = params.id;
        values.date = date;
        values.active = active;
        values.difference = values.amount - credit.amount;
        console.log("values", values);
        const res = await updateCredit(
          user,
          credit.id,
          values,
          "CustomerCredit"
        );
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
      <LoadingSpinner isSubmitting={isSubmitting} />
      {userClaims.admin ? (
        <div>
          <Dialog
            open={isEditDialogOpen}
            onClose={handleCloseForm}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
              Edit Customer credit
            </DialogTitle>
            <DialogContent
              sx={{ backgroundColor: theme.palette.background.alt }}
            >
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <CustomTextField
                    name="name" // <-- Match the formik field name
                    label="Name" // <-- Label can be different from the field name
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errors={formik.errors}
                    touched={formik.touched}
                  />

                  <CustomTextField
                    name="address" // Use lowercase field name
                    label="Address" // Use lowercase field name
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} // <-- Add this line
                    errors={formik.errors}
                    touched={formik.touched}
                  />

                  <CustomTextField
                    name="phone" // Use lowercase field name
                    label="Phone" // Use lowercase field name
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} // <-- Add this line
                    errors={formik.errors}
                    touched={formik.touched}
                  />

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

export default EditCustomerCreditForm;
