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
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { EssentialFormValidationSchema } from "./validation";
import updateEssential from "../../api/essential/edit";
import { useSnackbar } from "../../contexts/InfoContext";
import { useAuth } from "../../contexts/AuthContext";
import useUserClaims from "../../hooks/useUserClaims";
import CustomTextField from "../Credit/component/CustomTextField";
import { SpinnerContext } from "../../contexts/SpinnerContext";

const EditEssentialForm = ({ data, isEditDialogOpen, closeEditDialog }) => {
  const params = useParams();
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const userClaims = useUserClaims(user);
  let active = "";
  const storedData = localStorage.getItem("userData");
  if (storedData) {
    const userData = JSON.parse(storedData);
    active = userData ? userData.active : "try";
  }

  const formik = useFormik({
    initialValues: {
      name: data.name,
      sector: data.sector,
      company: data.company,
      address: data.address,
      phone: data.phone,
    },
    validationSchema: EssentialFormValidationSchema,
    onSubmit: async (values) => {
      // Send formData to the backend
      setIsSubmitting(true);
      try {
        values.branchId = params.id;
        values.name =
          values.name.charAt(0).toUpperCase() +
          values.name.slice(1).toLowerCase();
        const res = await updateEssential(user, data.id, values);
        openSnackbar(`${res.data.message} `, "success");
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
      {/*  */}
      {userClaims.superAdmin || userClaims.admin || userClaims.callCenter ? (
        <div>
          {!isSubmitting && (
            <Dialog
              open={isEditDialogOpen}
              onClose={handleCloseForm}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle
                sx={{ backgroundColor: theme.palette.background.alt }}
              >
                Edit Essential
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
                      name="company" // Use lowercase field name
                      label="company" // Use lowercase field name
                      value={formik.values.company}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur} // <-- Add this line
                      errors={formik.errors}
                      touched={formik.touched}
                    />

                    <CustomTextField
                      name="sector" // Use lowercase field name
                      label="sector" // Use lowercase field name
                      value={formik.values.sector}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur} // <-- Add this line
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

export default EditEssentialForm;
