import React, { useContext, useState } from "react";
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
import CustomTextField from "./CustomTextField";
import useUserClaims from "../../../hooks/useUserClaims";
import { BranchFormValidationSchema } from "../validator/BranchFormValidationSchema";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import createBranch from "../../../api/branch/createBranch";
import { SpinnerContext } from "../../../contexts/SpinnerContext";

const BranchForm = () => {
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();
  const userClaims = useUserClaims(user);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    // Your form submission logic here
    try {
      // Create the branch

      values["numberofworker"] = 0;
      values["manager"] = "not assigned";
      values["managerId"] = "not assigned";
      values["activeTable"] = "";
      values["activeSheet"] = "";
      values["activeDailySummery"] = "";
      values["active"] = "";
      values["openingDate"] = new Date().toISOString();
      values["worker"] = [];
      values["salaryTable"] = [];
      values["sheetStatus"] = "Completed";

      const res = await createBranch(user, values);

      openSnackbar(res.data.message, "success");
      handleClose();
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

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      phone: "",
      ethioTelBill: "",
      ethioTelAccount: "",
      ethioTelOwnerName: "",
      wifi: "",
      wifiAccount: "",
      wifiOwnerName: "",
      houseRent: "",
      houseRentAccount: "",
      houseRentOwnerName: "",
      account: "",
      budget: "",
      taxPersentage: "",
      ExpenseOneName: "",
      ExpenseOneAmount: "",
      ExpenseTwoName: "",
      ExpenseTwoAmount: "",
      ExpenseThreeName: "",
      ExpenseThreeAmount: "",
    },
    validationSchema: BranchFormValidationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div>
      {userClaims.superAdmin ? (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            disabled={isSubmitting}
          >
            Create new Branch
          </Button>
          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
              New Branch
            </DialogTitle>
            <DialogContent
              sx={{ backgroundColor: theme.palette.background.alt }}
            >
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
                    name="ethioTelOwnerName"
                    label="Ethiotele Bill Owner Name"
                    value={formik.values.ethioTelOwnerName}
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
                    name="ethioTelAccount"
                    label="Ethiotele Bill Account"
                    value={formik.values.ethioTelAccount}
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
                    name="wifiAccount"
                    label="Wifi Account"
                    value={formik.values.wifiAccount}
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
                    name="houseRentAccount"
                    label="House Rent Owner Account"
                    value={formik.values.houseRentAccount}
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
                    onClick={handleClose}
                    disabled={isSubmitting}
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
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default BranchForm;
