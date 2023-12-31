import React, { useContext } from "react";
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { ExpenseFormValidationSchema } from "./validation";
import updateExpense from "../../api/expense/edit";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/InfoContext";
import CustomTextField from "../Credit/component/CustomTextField";
import useUserClaims from "../../hooks/useUserClaims";
import { SpinnerContext } from "../../contexts/SpinnerContext";

const ExpenseEditForm = ({ credit, isEditDialogOpen, closeEditDialog }) => {
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();
  const { setIsSubmitting } = useContext(SpinnerContext);
  const userClaims = useUserClaims(user);

  const formik = useFormik({
    initialValues: {
      name: credit.name,
      amount: credit.amount,
    },
    validationSchema: ExpenseFormValidationSchema,
    onSubmit: async (values) => {
      // Send formData to the backend
      setIsSubmitting(true);
      try {
        values.financeId = user.uid;
        if (!values.financeId) {
          handleCloseForm();
          throw {
            response: {
              data: {
                message:
                  "Finance information is missing.Please check your connection, refresh your browser, and try again.",
                type: "error",
              },
            },
          };
        }
        values.difference = values.amount - credit.amount;
        const res = await updateExpense(user, credit.id, values);
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
    closeEditDialog();
    formik.resetForm();
  };

  return (
    <div>
      {userClaims.finance ? (
        <div>
          <Dialog
            open={isEditDialogOpen}
            onClose={handleCloseForm}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
              Edit Expense
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

export default ExpenseEditForm;
