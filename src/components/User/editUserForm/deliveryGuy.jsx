import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Avatar,
  useTheme,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import updateUser from "../../../api/users/edit";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import CustomTextField from "../../Credit/component/CustomTextField";
import { useParams } from "react-router-dom";
import getRequiredUserData from "../../../utils/getBranchInfo";
import capitalizeString from "../../../utils/capitalizeString";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  phone: Yup.string()
    .matches(/^\d+$/, "Phone must be a valid number")
    .required("Phone is required"),
  bankAccount: Yup.number()
    .typeError("Bank Account must be a number")
    .positive("Bank Account must be a positive number")
    .required("Bank Account is required"),
  fullAddress: Yup.string().required("Full Address is required"),
  securityName: Yup.string().required("Security Name is required"),
  securityAddress: Yup.string().required("Security Address is required"),
  securityPhone: Yup.string()
    .matches(/^\d+$/, "Security Phone must be a valid number")
    .required("Security Phone is required"),
});

const DeliveryGuyEditForm = ({
  deliveryguy,
  isEditDialogOpen,
  closeEditDialog,
}) => {
  const { user, forgotPassword } = useAuth();
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();
  const {isSubmitting, setIsSubmitting} = useContext(SpinnerContext);
  const params = useParams();
  const branchData = getRequiredUserData();
  // Handle form submission
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      values.branchId = params.id ? params.id : branchData.requiredId;
      values.active = branchData.active;
      values.activeTable = branchData.activeTable;
      const name = capitalizeString(values.fullName);
      values.fullName = name;
      values.nameChange = values.fullName !== deliveryguy.fullName;
      if (values.nameChange) {
        values.uniqueName = deliveryguy.uniqueName;
      }

      const res = await updateUser(user, deliveryguy.id, values, "deliveryGuy");
      openSnackbar(res.data.message, "success");
      handleCloseForm();
    } catch (error) {
      openSnackbar(
        error.response.data.message,
        error.response.data.type ? error.response.data.type : "error"
      );
    }
    setIsSubmitting(false);
  };

  // Initialize form values with admin data when the component is mounted
  const formik = useFormik({
    initialValues: {
      fullName: deliveryguy.fullName,
      phone: deliveryguy.phone,
      bankAccount: deliveryguy.bankAccount,
      fullAddress: deliveryguy.fullAddress,
      securityName: deliveryguy.securityName,
      securityAddress: deliveryguy.securityAddress,
      securityPhone: deliveryguy.securityPhone,
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  // Close the form and reset it
  const handleCloseForm = () => {
    closeEditDialog();
    formik.resetForm();
  };

  return (
    <div>
      
      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
          Edit Delivery Guy
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: theme.palette.background.alt }}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <CustomTextField
                label="Full Name"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                label="Phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                label="Bank Account"
                name="bankAccount"
                value={formik.values.bankAccount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                label="Full Address"
                name="fullAddress"
                value={formik.values.fullAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                label="Security Name"
                name="securityName"
                value={formik.values.securityName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                label="Security Address"
                name="securityAddress"
                value={formik.values.securityAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                label="Security Phone"
                name="securityPhone"
                value={formik.values.securityPhone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
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
                    sx={{
                      color: theme.palette.secondary[100],
                      "&:hover": {
                        backgroundColor: theme.palette.background.alt,
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      color: theme.palette.secondary[100],
                      "&:hover": {
                        backgroundColor: theme.palette.background.alt,
                      },
                    }}
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryGuyEditForm;
