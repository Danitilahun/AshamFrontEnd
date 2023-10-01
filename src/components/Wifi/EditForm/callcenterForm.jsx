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
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation

import create from "../../../api/orders/create";
import { useSnackbar } from "../../../contexts/InfoContext";
import { useAuth } from "../../../contexts/AuthContext";
import fetchData from "../../../api/services/Users/getUser";
import getInternationalDate from "../../../utils/getDate";
import { SpinnerContext } from "../../../contexts/SpinnerContext";
import CustomTextField from "../../VersatileComponents/orderTextInput";
import update from "../../../api/orders/edit";
import useUserClaims from "../../../hooks/useUserClaims";
// Define the validation schema including order item validation
const EditWifiOrderFormValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  blockHouse: Yup.string().required("Block House is required"),
  phone: Yup.string().required("Phone is required"),
  deliveryguyId: Yup.string().required("Please select a Delivery Guy"),
  branchId: Yup.string().required("Please select a Branch"),
  accountNumber: Yup.string().required("Account Number is required"),
  ownerName: Yup.string().required("Owner Name is required"),
});

const EditWifiOrderForm = ({
  data,
  isEditDialogOpen,
  closeEditDialog,
  fromWhere,
}) => {
  const params = useParams();
  const [showForm, setShowForm] = useState(false);
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const [branches, setBranches] = useState([]);
  const [deliveryGuy, setDeliveryGuy] = useState([]);
  const userClaims = useUserClaims(user);
  useEffect(() => {
    const unsubscribe = fetchData("branches", setBranches);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = fetchData("Deliveryturn", setDeliveryGuy);
    return () => unsubscribe();
  }, []);

  const handleBranchChange = (event) => {
    // setSelectedDeliveryGuy(event.target.value);
    const Id = event.target.value;
    const Name = branch.find((branch) => branch[1] === Id)?.[0] || "";
    const ActiveTable = branch.find((branch) => branch[1] === Id)?.[2] || "";
    const Active = branch.find((branch) => branch[1] === Id)?.[3] || "";
    const ActiveDailySummery =
      branch.find((branch) => branch[1] === Id)?.[4] || "";
    formik.setFieldValue("branchId", Id);
    formik.setFieldValue("branchName", Name);
    formik.setFieldValue("activeTable", ActiveTable);
    formik.setFieldValue("active", Active);
    formik.setFieldValue("activeDailySummery", ActiveDailySummery);
  };

  const handleDeliveryGuyChange = (event) => {
    const Id = event.target.value;
    const Name = deliveryman.find((employee) => employee[1] === Id)?.[0] || "";
    formik.setFieldValue("deliveryguyName", Name);
    formik.setFieldValue("deliveryguyId", Id);
  };

  const branch = branches?.map((item) => [
    item.name,
    item.id,
    item.activeTable,
    item.active,
    item.activeDailySummery,
  ]);

  console.log("branch", branch);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const formik = useFormik({
    initialValues: {
      name: data.name,
      phone: data.phone,
      blockHouse: data.blockHouse,
      ownerName: fromWhere === "edit" ? data.ownerName : "",
      accountNumber: fromWhere === "edit" ? data.accountNumber : "",
      branchId: fromWhere === "edit" ? data.branchId : "",
      branchName: fromWhere === "edit" ? data.branchName : "",
      deliveryguyId: fromWhere === "edit" ? data.deliveryguyId : "",
      deliveryguyName: fromWhere === "edit" ? data.deliveryguyName : "",
      activeTable: fromWhere === "edit" ? data.activeTable : "",
      active: fromWhere === "edit" ? data.active : "",
      activeDailySummery: fromWhere === "edit" ? data.activeDailySummery : "",
    },

    validationSchema: EditWifiOrderFormValidationSchema,
    onSubmit: async (values) => {
      // Send formData to the backend
      setIsSubmitting(true);
      try {
        const date = getInternationalDate();
        values.date = date;
        values.callcenterId = user.uid;
        values.status = "new order";
        values.blockHouse = values.blockHouse.toUpperCase();
        console.log("values", values);
        const res = await update(user, data.id, values, "wifi");
        openSnackbar(`${res.data.message}!`, "success");
        handleCloseForm();
      } catch (error) {
        if (error.response && error.response.data) {
          openSnackbar(
            error.response.data.message,
            error.response.data.type ? error.response.data.type : "error"
          );
        } else {
          openSnackbar("An unexpected error occurred.", "error");
        }
      }
      setIsSubmitting(false);
    },
  });

  const handleCloseForm = () => {
    closeEditDialog();
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
        `${branchName} branch does not have a daily table today. So you can't create an order. Please inform the branch to create a daily table in their sheet.`,
        "info"
      );
    }
  }, [formik.values]);

  return (
    <div>
      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
          Edit Wifi Order
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
                name="accountNumber"
                label="accountNumber"
                value={formik.values.accountNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.errors.accountNumber && formik.touched.accountNumber
                }
                helperText={
                  formik.errors.accountNumber && formik.touched.accountNumber
                    ? formik.errors.accountNumber
                    : ""
                }
                touched={formik.touched.accountNumber}
              />

              <CustomTextField
                name="ownerName"
                label="ownerName"
                value={formik.values.ownerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.ownerName && formik.touched.ownerName}
                helperText={
                  formik.errors.ownerName && formik.touched.ownerName
                    ? formik.errors.ownerName
                    : ""
                }
                touched={formik.touched.ownerName}
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

export default EditWifiOrderForm;
