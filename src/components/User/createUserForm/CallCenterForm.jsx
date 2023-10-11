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
import { useAuth } from "../../../contexts/AuthContext";
import handleImagePreview from "../../../utils/imagePreview";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CustomTextField from "../../Credit/component/CustomTextField";
import fetchData from "../../../api/services/Users/getUser";
import createUser from "../../../api/users/create";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import { useSnackbar } from "../../../contexts/InfoContext";
import useUserClaims from "../../../hooks/useUserClaims";
import capitalizeString from "../../../utils/capitalizeString";

const FILE_SIZE = 160 * 1024;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  phone: Yup.string()
    .matches(/^\d+$/, "Phone must be a valid number")
    .required("Phone is required"),
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
  profileImage: Yup.mixed()
    .notRequired()
    .test(
      "fileFormat",
      "Unsupported Format. Only JPEG, PNG, and GIF images are supported",
      (value) => !value || SUPPORTED_FORMATS.includes(value.type)
    )
    .test(
      "fileSize",
      "File too large",
      (value) => !value || value.size <= FILE_SIZE
    ),
});

const CallcenterRegisterForm = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user, forgotPassword } = useAuth();
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const userClaims = useUserClaims(user);
  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const name = capitalizeString(values.fullName);
      values.fullName = name;
      const formData = new FormData();
      // Loop through the initial values and append them to the formData
      for (const key in values) {
        formData.append(key, values[key]);
      }
      formData.append("disable", false);
      const res = await createUser(user, formData, "callCenter");
      forgotPassword(values.email);
      openSnackbar(res.data.message, "success");
      handleCloseForm();
    } catch (error) {
      // Handle errors
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
      fullName: "",
      phone: "",
      email: "",
      bankAccount: "",
      fullAddress: "",
      securityName: "",
      securityAddress: "",
      securityPhone: "",
      salary: "",
      profileImage: null,
    },
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  const handleOpen = () => {
    setImagePreview(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    formik.resetForm();
  };

  const handleImageChange = (e) => {
    console.log(e.currentTarget.files[0]);
    handleImagePreview(e, setImagePreview);
    formik.setFieldValue("profileImage", e.currentTarget.files[0]);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create new Call Center
      </Button>

      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
          New Call Center
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: theme.palette.background.alt }}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                container
                alignItems="center"
                justifyContent="center"
              >
                <Grid item>
                  {imagePreview ? (
                    <Avatar
                      src={imagePreview}
                      sx={{ width: 100, height: 100 }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        backgroundColor: theme.palette.secondary[100],
                      }}
                    >
                      <AddPhotoAlternateIcon />
                    </Avatar>
                  )}
                </Grid>
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <label
                  htmlFor="profileImage"
                  style={{
                    backgroundColor: theme.palette.background.alt,
                    padding: "10px 15px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    display: "block",
                    width: "200px",
                    margin: "0 auto",
                    textAlign: "center",
                  }}
                >
                  Choose a profile image
                </label>
                <TextField
                  type="file"
                  name="profileImage"
                  id="profileImage"
                  accept="image/*"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    formik.setFieldValue(
                      "profileImage",
                      e.currentTarget.files[0]
                    );
                    handleImageChange(e); // Also call your image preview function here if needed
                  }}
                  onBlur={formik.handleBlur}
                  style={{ display: "none" }}
                  error={
                    formik.touched.profileImage &&
                    Boolean(formik.errors.profileImage)
                  }
                  helperText={
                    formik.touched.profileImage && formik.errors.profileImage
                  }
                />
                {formik.touched.profileImage &&
                  Boolean(formik.errors.profileImage) && (
                    <div style={{ color: "red", marginTop: "20px" }}>
                      {formik.errors.profileImage}
                    </div>
                  )}
              </Grid>

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

export default CallcenterRegisterForm;
