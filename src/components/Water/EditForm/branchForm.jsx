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
const EditWaterOrderFormValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  blockHouse: Yup.string().required("Block House is required"),
  phone: Yup.string().required("Phone is required"),
  deliveryguyId: Yup.string().required("Please select a Delivery Guy"),
  branchId: Yup.string().required("Please select a Branch"),
  customerKey: Yup.string().required("Customer Key is required"),
  billPayerName: Yup.string().required("Bill Payer Name is required"),
});

const EditWaterOrderForm = ({
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
  const [deliveryGuy, setDeliveryGuy] = useState([]);
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
    setShowForm(true);
  };

  const formik = useFormik({
    initialValues: {
      name: data.name,
      phone: data.phone,
      blockHouse: data.blockHouse,
      billPayerName: fromWhere === "edit" ? data.billPayerName : "",
      customerKey: fromWhere === "edit" ? data.customerKey : "",
      branchId: data.branchId,
      branchName: data.branchName,
      deliveryguyId: fromWhere === "edit" ? data.deliveryguyId : "",
      deliveryguyName: fromWhere === "edit" ? data.deliveryguyName : "",
      activeTable: data.activeTable,
      active: data.active,
      activeDailySummery: data.activeDailySummery,
      callcenterId: data.callcenterId,
    },

    validationSchema: EditWaterOrderFormValidationSchema,
    onSubmit: async (values) => {
      // Send formData to the backend
      setIsSubmitting(true);
      try {
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

        const date = getInternationalDate();
        values.date = date;
        values.status = "new order";
        values.blockHouse = values.blockHouse.toUpperCase();
        console.log("values", values);
        const res = await update(user, data.id, values, "water");
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
    closeEditDialog();
    formik.resetForm();
  };

  const deliveryMan = deliveryGuy
    ? deliveryGuy[formik.values.callcenterId ? formik.values.callcenterId : ""]
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
          Edit Water Order
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

export default EditWaterOrderForm;
