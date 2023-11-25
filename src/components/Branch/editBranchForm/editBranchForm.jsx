import React, { useContext } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import { useTheme } from "@emotion/react";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import { BranchFormValidationSchema } from "../validator/BranchFormValidationSchema";
import CustomTextField from "../createBranchForm/CustomTextField";
import updateBranch from "../../../api/branch/editBranch";
import updateBranchName from "../../../api/branch/nameChange";

const EditBranchForm = ({ branch, isEditDialogOpen, closeEditDialog }) => {
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Update the branch with the new data
      values.nameChange = values.name !== branch.name;
      values.budgetChange = values.budget !== branch.budget;
      values.managerId = branch.managerId;
      values.difference = values.budget - branch.budget;
      values.active = branch.active;

      if (values.ExpenseOneAmount === "") {
        values.ExpenseOneName = branch.ExpenseOneName;
      }

      if (values.ExpenseTwoAmount === "") {
        values.ExpenseTwoName = branch.ExpenseTwoName;
      }

      if (values.ExpenseThreeAmount === "") {
        values.ExpenseThreeName = branch.ExpenseThreeName;
      }

      const res = await updateBranch(user, branch.id, values); // Replace with your API update function
      openSnackbar(res.data.message, "success");
      handleCloseForm();
      if (values.nameChange) {
        await updateBranchName(user, branch.id, values);
      }
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
  // Initialize form values with branch data when the component is mounted
  const formik = useFormik({
    initialValues: {
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      ethioTelBill: branch.ethioTelBill,
      ethioTelAccount: branch.ethioTelAccount,
      ethioTelOwnerName: branch.ethioTelOwnerName,
      wifi: branch.wifi,
      wifiAccount: branch.wifiAccount,
      wifiOwnerName: branch.wifiOwnerName,
      houseRent: branch.houseRent,
      houseRentAccount: branch.houseRentAccount,
      houseRentOwnerName: branch.houseRentOwnerName,
      account: branch.account,
      budget: branch.budget,
      taxPersentage: branch.taxPersentage,
      ExpenseOneName: branch.ExpenseOneName,
      ExpenseOneAmount: branch.ExpenseOneAmount,
      ExpenseTwoName: branch.ExpenseTwoName,
      ExpenseTwoAmount: branch.ExpenseTwoAmount,
      ExpenseThreeName: branch.ExpenseThreeName,
      ExpenseThreeAmount: branch.ExpenseThreeAmount,
    },
    // Define your validation schema (similar to BranchForm)
    validationSchema: BranchFormValidationSchema,
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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
          Edit Branch
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: theme.palette.background.alt }}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <CustomTextField
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />
              <CustomTextField
                name="address"
                label="Address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                name="ethioTelBill"
                label="Ethiotele Bill Amount"
                type="number"
                value={formik.values.ethioTelBill}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                name="phone"
                label="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                name="ethioTelAccount"
                label="Ethiotele Bill Account"
                value={formik.values.ethioTelAccount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                name="wifi"
                label="Wifi Amount"
                type="number"
                value={formik.values.wifi}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                name="ethioTelOwnerName"
                label="Ethiotele Bill Owner Name"
                value={formik.values.ethioTelOwnerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                name="wifiAccount"
                label="Wifi Account"
                value={formik.values.wifiAccount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                name="houseRent"
                label="House Rent Amount"
                type="number"
                value={formik.values.houseRent}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                name="wifiOwnerName"
                label="Wifi Owner Name"
                value={formik.values.wifiOwnerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />
              <CustomTextField
                name="houseRentAccount"
                label="House Rent Owner Account"
                value={formik.values.houseRentAccount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                name="account"
                label="Account"
                type="number"
                value={formik.values.account}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                name="houseRentOwnerName"
                label="House Rent Owner Name"
                value={formik.values.houseRentOwnerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />

              <CustomTextField
                name="budget"
                label="Budget"
                type="number"
                value={formik.values.budget}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />
              <CustomTextField
                name="taxPersentage"
                label="Tax Percentage"
                type="number"
                value={formik.values.taxPersentage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
              />
              <Grid item xs={12} sx={{ mt: 3 }}>
                Other Expenses
              </Grid>

              <CustomTextField
                name="ExpenseOneName"
                label="Expense One Name"
                type="text"
                value={formik.values.ExpenseOneName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
                required={false}
              />

              <CustomTextField
                name="ExpenseOneAmount"
                label="Expense One Amount"
                type="number"
                value={formik.values.ExpenseOneAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
                required={false}
              />

              <CustomTextField
                name="ExpenseTwoName"
                label="Expense Two Name"
                type="text"
                value={formik.values.ExpenseTwoName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
                required={false}
              />

              <CustomTextField
                name="ExpenseTwoAmount"
                label="Expense Two Amount"
                type="number"
                value={formik.values.ExpenseTwoAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
                required={false}
              />

              <CustomTextField
                name="ExpenseThreeName"
                label="Expense Three Name"
                type="text"
                value={formik.values.ExpenseThreeName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
                required={false}
              />

              <CustomTextField
                name="ExpenseThreeAmount"
                label="Expense Three Amount"
                type="number"
                value={formik.values.ExpenseThreeAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // <-- Add this line
                errors={formik.errors}
                touched={formik.touched}
                required={false}
              />
            </Grid>
            <DialogActions
              sx={{ backgroundColor: theme.palette.background.alt }}
            >
              <Button
                variant="contained"
                disabled={isSubmitting}
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
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                backgroundColor={theme.palette.background.alt}
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
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditBranchForm;
