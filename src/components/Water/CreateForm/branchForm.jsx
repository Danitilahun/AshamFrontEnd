import React, { useContext, useEffect, useState } from "react";
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
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import { useSnackbar } from "../../../contexts/InfoContext";
import { useAuth } from "../../../contexts/AuthContext";
import fetchData from "../../../api/services/Users/getUser";
import getInternationalDate from "../../../utils/getDate";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import CustomTextField from "../../VersatileComponents/orderTextInput";
import getRequiredUserData from "../../../utils/getBranchInfo";
import create from "../../../api/orders/create";
import useUserClaims from "../../../hooks/useUserClaims";
// Define the validation schema including order item validation
const WaterOrderFormValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  blockHouse: Yup.string().required("Block House is required"),
  phone: Yup.string().required("Phone is required"),
  customerKey: Yup.string().required("Customer Key is required"),
  billPayerName: Yup.string().required("Bill Payer Name is required"),
  deliveryguyId: Yup.string().required("Please select a Delivery Guy"),
  branchId: Yup.string().required("Please select a Branch"),
});

const WaterOrderBranchForm = () => {
  const [showForm, setShowForm] = useState(false);
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();
  const { setIsSubmitting } = useContext(SpinnerContext);
  const [deliveryGuy, setDeliveryGuy] = useState([]);
  const userData = getRequiredUserData();
  const userClaims = useUserClaims(user);
  useEffect(() => {
    const unsubscribe = fetchData("Deliveryturn", setDeliveryGuy);
    return () => unsubscribe();
  }, []);

  const handleDeliveryGuyChange = (event) => {
    const Id = event.target.value;
    const Name = deliveryman.find((employee) => employee[1] === Id)?.[0] || "";
    formik.setFieldValue("deliveryguyName", Name);
    formik.setFieldValue("deliveryguyId", Id);
  };

  const handleButtonClick = () => {
    if (userData.activeTable) {
      setShowForm(true);
    } else {
      openSnackbar(
        `${userData.branchName} branch does not have a daily table today or sheet. So you can't create an order. Please create a sheet or table.`,
        "info"
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      blockHouse: "",
      billPayerName: "",
      customerKey: "",
      deliveryguyName: "",
      branchName: userData.branchName,
      branchId: userData.requiredId,
      deliveryguyId: "",
      activeTable: userData.activeTable,
      active: userData.active,
      activeDailySummery: userData.activeDailySummery,
    },

    validationSchema: WaterOrderFormValidationSchema,
    onSubmit: async (values) => {
      // Send formData to the backend
      setIsSubmitting(true);
      try {
        const date = getInternationalDate();
        values.date = date;
        values.callcenterId = userData.requiredId
          ? userData.requiredId
          : user.displayName;

        if (!values.deliveryguyId || !values.deliveryguyName) {
          handleCloseForm();
          throw {
            response: {
              data: {
                message:
                  "Delivery guy information is not found. Please check your connection, refresh your browser, and try again.",
                type: "error",
              },
            },
          };
        }

        if (
          !values.branchId ||
          !values.branchName ||
          !values.activeTable ||
          !values.active ||
          !values.activeDailySummery
        ) {
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

        values.status = "Assigned";
        values.branchKey = values.callcenterId;
        values.blockHouse = values.blockHouse.toUpperCase();
        values.from = "branch";
        const res = await create(user, values, "water");
        openSnackbar(`${res.data.message}!`, "success");
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

  const deliveryMan = deliveryGuy
    ? deliveryGuy[formik.values.branchId ? formik.values.branchId : ""]
    : [];
  const deliveryman = deliveryMan?.map((item) => [
    item.deliveryGuyName,
    item.deliveryManId,
  ]);

  useEffect(() => {
    const { branchId, activeTable, branchName } = formik.values;
    if (branchId && !activeTable) {
      openSnackbar(
        `${branchName} branch does not have a daily table today or sheet. So you can't create an order. Please create Sheet or Table.`,
        "info"
      );
    }
  }, [formik.values]);

  return (
    <div>
      {userClaims.admin ? (
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Create new Water Order
        </Button>
      ) : null}

      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
          New Water Order
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: theme.palette.background.alt }}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              {/* Name */}
              <CustomTextField
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.name && formik.touched.name}
                helperText={
                  formik.errors.name && formik.touched.name
                    ? formik.errors.name
                    : ""
                }
                touched={formik.touched.name}
              />

              {/* Phone */}
              <CustomTextField
                name="phone"
                label="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.phone && formik.touched.phone}
                helperText={
                  formik.errors.phone && formik.touched.phone
                    ? formik.errors.phone
                    : ""
                }
                touched={formik.touched.phone}
              />

              {/* blockHouse */}
              <CustomTextField
                name="blockHouse"
                label="blockHouse"
                value={formik.values.blockHouse}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.blockHouse && formik.touched.blockHouse}
                helperText={
                  formik.errors.blockHouse && formik.touched.blockHouse
                    ? formik.errors.blockHouse
                    : ""
                }
                touched={formik.touched.blockHouse}
              />

              <CustomTextField
                name="customerKey"
                label="customerKey"
                value={formik.values.customerKey}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.customerKey && formik.touched.customerKey}
                helperText={
                  formik.errors.customerKey && formik.touched.customerKey
                    ? formik.errors.customerKey
                    : ""
                }
                touched={formik.touched.customerKey}
              />

              <CustomTextField
                name="billPayerName"
                label="billPayerName"
                value={formik.values.billPayerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.errors.billPayerName && formik.touched.billPayerName
                }
                helperText={
                  formik.errors.billPayerName && formik.touched.billPayerName
                    ? formik.errors.billPayerName
                    : ""
                }
                touched={formik.touched.billPayerName}
              />

              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  select
                  name="deliveryguyId"
                  variant="outlined"
                  fullWidth
                  required
                  value={formik.values.deliveryguyId}
                  onChange={handleDeliveryGuyChange}
                  onBlur={formik.handleBlur} // <-- Add this line
                  label="Delivery Guy"
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
                    formik.touched.deliveryguyId &&
                    Boolean(formik.errors.deliveryguyId)
                  }
                  helperText={
                    formik.touched.deliveryguyId && formik.errors.deliveryguyId
                  }
                >
                  <MenuItem value="">Select Delivery Guy</MenuItem>
                  {deliveryman?.map((branch) => (
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
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="submit-button" // Add a CSS class for styling
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

export default WaterOrderBranchForm;
