import React, { useContext, useState } from "react";
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
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import { CustomerCreditFormValidationSchema } from "../validator/customerCreditValidator";
import getRequiredUserData from "../../../utils/getBranchInfo";
import capitalizeString from "../../../utils/capitalizeString";

const CustomerCreditForm = ({ type }) => {
  const params = useParams();
  const [showForm, setShowForm] = useState(false);
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const userClaims = useUserClaims(user);

  const userData = getRequiredUserData();
  const handleButtonClick = () => {
    setShowForm(true);
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      amount: "",
      reason: "",
      address: "",
      phone: "",
    },
    validationSchema: CustomerCreditFormValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const date = getInternationalDate();
        values.branchId = params.id
          ? params.id
          : user.displayName
          ? user.displayName
          : userData.requiredId;

        const name = capitalizeString(values.name);

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

        values.name = name;
        values.date = date;
        values.type = type;
        values.active = userData.active;

        if (!values.active) {
          handleCloseForm();
          throw {
            response: {
              data: {
                message:
                  "You do not have Salary Table.Create salary table before.",
                type: "info",
              },
            },
          };
        }

        const res = await createCredit(user, values, "CustomerCredit");

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
    setShowForm(false);
    formik.resetForm();
  };

  return (
    <div>
      {userClaims.admin ? (
        <div>
          {userClaims.admin ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleButtonClick}
            >
              Create new Customer credit
            </Button>
          ) : null}

          <Dialog
            open={showForm}
            onClose={handleCloseForm}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
              New Customer credit
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

export default CustomerCreditForm;
