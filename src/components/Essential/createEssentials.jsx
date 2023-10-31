import React, { useContext, useState } from "react";
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  MenuItem,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";

import { useFormik } from "formik";
import { EssentialFormValidationSchema } from "./validation";
import createEssential from "../../api/essential/create";
import LoadingSpinner from "../VersatileComponents/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/InfoContext";
import CustomTextField from "../Credit/component/CustomTextField";
import useUserClaims from "../../hooks/useUserClaims";
import { SpinnerContext } from "../../contexts/SpinnerContext";

const EssentialForm = ({ type }) => {
  const params = useParams();
  const [showForm, setShowForm] = useState(false);
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const userClaims = useUserClaims(user);
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);

  const handleButtonClick = () => {
    setShowForm(true);
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      company: "",
      sector: "",
      address: "",
      phone: "",
    },

    validationSchema: EssentialFormValidationSchema,
    onSubmit: async (values) => {
      // Send formData to the backend
      setIsSubmitting(true);
      try {
        values.branchId = params.id;
        values.name =
          values.name.charAt(0).toUpperCase() + values.name.slice(1);
        console.log("values", values);
        const res = await createEssential(user, values);
        openSnackbar(`${res.data.message}`, "success");
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
    <div style={{ zIndex: 6000 }}>
      {userClaims.superAdmin || userClaims.admin || userClaims.callCenter ? (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
          >
            Create New Essential
          </Button>

          {!isSubmitting && (
            <Dialog
              open={showForm}
              onClose={handleCloseForm}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle
                sx={{ backgroundColor: theme.palette.background.alt }}
              >
                New Essential
              </DialogTitle>
              <DialogContent
                sx={{ backgroundColor: theme.palette.background.alt }}
              >
                <form onSubmit={formik.handleSubmit}>
                  <Grid container spacing={2}>
                    <CustomTextField
                      label="Name"
                      name="name"
                      value={formik.values.name}
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
                      name="address"
                      label="Address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      errors={formik.errors}
                      touched={formik.touched}
                    />
                    <CustomTextField
                      name="company"
                      label="Company"
                      value={formik.values.company}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      errors={formik.errors}
                      touched={formik.touched}
                    />

                    <CustomTextField
                      name="sector"
                      label="sector"
                      value={formik.values.sector}
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
                          color="secondary"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          Submit
                        </Button>
                      </DialogActions>
                    </Grid>
                  </Grid>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default EssentialForm;
