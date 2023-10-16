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
import fetchData from "../../../api/services/Users/getUser";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import CustomTextField from "../../Credit/component/CustomTextField";
import capitalizeString from "../../../utils/capitalizeString";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  phone: Yup.string()
    .matches(/^\d+$/, "Phone must be a valid number")
    .required("Phone is required"),
  branchId: Yup.string().required("Branch is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
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
});

const AdminEditForm = ({ admin, isEditDialogOpen, closeEditDialog }) => {
  const { user, forgotPassword } = useAuth();
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    const unsubscribe = fetchData("branches", setBranches);
    return () => {
      unsubscribe();
    };
  }, []);

  const branch = branches.map((item) => [item.name, item.id, item.active]);

  const handleBranchChange = (event) => {
    // setSelectedDeliveryGuy(event.target.value);
    const Id = event.target.value;
    const Name = branch.find((branch) => branch[1] === Id)?.[0] || "";
    const active = branch.find((branch) => branch[1] === Id)?.[2] || "";
    formik.setFieldValue("branchId", Id);
    formik.setFieldValue("branchName", Name);
    formik.setFieldValue("active", active);
  };
  // Handle form submission
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const name = capitalizeString(values.fullName);
      values.fullName = name;
      values.nameChange = values.fullName !== admin.fullName;
      values.phoneChange = values.phone !== admin.phone;
      values.addressChange = values.fullAddress !== admin.fullAddress;
      values.branchIdChange = values.branchId !== admin.branchId;
      if (values.branchIdChange) {
        values.oldBranchId = admin.branchId;
      }
      values.emailChange = values.email !== admin.email;
      values.salaryChange = values.salary !== admin.salary;
      if (values.salaryChange) {
        values.difference = values.salary - admin.salary;
      }
      const active =
        branch.find((branch) => branch[1] === values.branchId)?.[2] || "";
      values.active = active;

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
      // Update the admin with the new data
      const res = await updateUser(user, admin.id, values, "admin");
      // Replace with your API update function
      if (values.email !== admin.email) {
        forgotPassword(values.email);
      }
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
      fullName: admin.fullName,
      phone: admin.phone,
      branchId: admin.branchId,
      branchName: admin.branchName,
      email: admin.email,
      branchId: admin.branchId,
      bankAccount: admin.bankAccount,
      fullAddress: admin.fullAddress,
      securityName: admin.securityName,
      securityAddress: admin.securityAddress,
      securityPhone: admin.securityPhone,
      salary: admin.salary,
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
          Edit Admin
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
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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

              <CustomTextField
                label="Salary"
                name="salary"
                value={formik.values.salary}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
              />
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  select
                  name="branchId"
                  variant="outlined"
                  fullWidth
                  required
                  value={formik.values.branchId}
                  onChange={handleBranchChange}
                  onBlur={formik.handleBlur} // <-- Add this line
                  label="Branch"
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
                    formik.touched.branchId && Boolean(formik.errors.branchId)
                  }
                  helperText={formik.touched.branchId && formik.errors.branchId}
                >
                  <MenuItem value="">Select Branch</MenuItem>
                  {branch?.map((branch) => (
                    <MenuItem key={branch[1]} value={branch[1]}>
                      {branch[0]}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
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

export default AdminEditForm;
