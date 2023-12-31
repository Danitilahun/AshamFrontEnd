import React, { useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
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
  salary: Yup.number()
    .positive("Salary must be a positive number")
    .typeError("Salary must be a number")
    .required("Salary is required"),
  role: Yup.string().required("Role is required"),
});

const StaffEditForm = ({ staff, isEditDialogOpen, closeEditDialog }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const params = useParams();
  const { openSnackbar } = useSnackbar();
  const { setIsSubmitting } = useContext(SpinnerContext);
  const branchData = getRequiredUserData();
  // Handle form submission
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Update the admin with the new data
      values.branchId = branchData.requiredId
        ? branchData.requiredId
        : params.id;
      values.active = branchData.active;

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
      values.salaryChange = values.salary !== staff.salary;
      if (values.salaryChange) {
        values.difference = values.salary - staff.salary;
      }
      const name = capitalizeString(values.fullName);
      values.fullName = name;
      values.nameChange = values.fullName !== staff.fullName;
      if (values.nameChange) {
        values.uniqueName = staff.uniqueName;
      }
      const res = await updateUser(user, staff.id, values, "staff");
      openSnackbar(res.data.message, "success");
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
  };

  // Initialize form values with admin data when the component is mounted
  const formik = useFormik({
    initialValues: {
      fullName: staff.fullName,
      phone: staff.phone,
      bankAccount: staff.bankAccount,
      fullAddress: staff.fullAddress,
      securityName: staff.securityName,
      securityAddress: staff.securityAddress,
      securityPhone: staff.securityPhone,
      salary: staff.salary,
      role: staff.role,
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
          Edit Staff Member
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

              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  select
                  name="role"
                  variant="outlined"
                  fullWidth
                  required
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  error={formik.touched.role && Boolean(formik.errors.role)}
                  helperText={formik.touched.role && formik.errors.role}
                  label="Role"
                >
                  <MenuItem value="Cleaner">Cleaner</MenuItem>
                  <MenuItem value="Keeper">Keeper</MenuItem>
                  <MenuItem value="Bike Technician">Bike Technician</MenuItem>
                  <MenuItem value="Wifi Technician">Wifi Technician</MenuItem>
                </TextField>
              </Grid>
              <CustomTextField
                label="Salary"
                name="salary"
                value={formik.values.salary}
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

export default StaffEditForm;
