import React, { useEffect, useState } from "react";
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
import LoadingSpinner from "../../VersatileComponents/LoadingSpinner";
import CustomTextField from "../../VersatileComponents/orderTextInput";
import getRequiredUserData from "../../../utils/getBranchInfo";
import update from "../../../api/orders/edit";
import create from "../../../api/orders/create";
import useUserClaims from "../../../hooks/useUserClaims";
import capitalizeString from "../../../utils/capitalizeString";
// Define the validation schema including order item validation
const AsbezaOrderFormValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  blockHouse: Yup.string().required("Block House is required"),
  phone: Yup.string().required("Phone is required"),
  deliveryguyId: Yup.string().required("Please select a Delivery Guy"),
  branchId: Yup.string().required("Please select a Branch"),
  order: Yup.array().of(Yup.string().required("Order item is required")), // Validation for each order item
});

const AsbezaOrderBranchForm = () => {
  const [showForm, setShowForm] = useState(false);
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      additionalInfo: "",
      order: [],
      deliveryguyName: "",
      branchName: userData.branchName,
      branchId: userData.requiredId,
      deliveryguyId: "",
      activeTable: userData.activeTable,
      active: userData.active,
      activeDailySummery: userData.activeDailySummery,
    },

    validationSchema: AsbezaOrderFormValidationSchema,
    onSubmit: async (values) => {
      // Send formData to the backend
      setIsSubmitting(true);
      try {
        const date = getInternationalDate();
        const name = capitalizeString(values.name);
        values.name = name;
        values.date = date;
        values.callcenterId = userData.requiredId
          ? userData.requiredId
          : user.displayName;
        values.status = "new order";
        values.blockHouse = values.blockHouse.toUpperCase();
        values.from = "branch";
        console.log("values", values);
        const res = await create(user, values, "asbeza");
        openSnackbar(`${res.data.message}!`, "success");
        handleCloseForm();
      } catch (error) {
        openSnackbar(
          error.response.data.message,
          error.response.data.type ? error.response.data.type : "error"
        );
      }
      setIsSubmitting(false);
    },
  });

  const handleCloseForm = () => {
    setShowForm(false);
    formik.resetForm();
  };

  const handleAddOrderItem = () => {
    formik.setFieldValue("order", [...formik.values.order, ""]);
  };

  const handleRemoveOrderItem = (index) => {
    const newOrder = [...formik.values.order];
    newOrder.splice(index, 1);
    formik.setFieldValue("order", newOrder);
  };

  const deliveryMan =
    deliveryGuy[formik.values.branchId ? formik.values.branchId : ""];
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
      <LoadingSpinner isSubmitting={isSubmitting} />
      {userClaims.admin ? (
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Create new Asbeza Order
        </Button>
      ) : null}

      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
          New Asbeza Order
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
              {/* additionalInfo */}
              <CustomTextField
                name="additionalInfo"
                label="additionalInfo"
                value={formik.values.additionalInfo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.errors.additionalInfo && formik.touched.additionalInfo
                }
                helperText={
                  formik.errors.additionalInfo && formik.touched.additionalInfo
                    ? formik.errors.additionalInfo
                    : ""
                }
                touched={formik.touched.additionalInfo}
                required={false}
              />

              {formik.values.order.map((item, index) => (
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={9} sm={9} md={9} lg={9}>
                      <CustomTextField
                        name={`order[${index}]`}
                        label={`Order ${index + 1}`}
                        value={item}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.errors.order && formik.errors.order[index]
                        }
                        touched={
                          formik.touched.order && formik.touched.order[index]
                        }
                        helperText={
                          formik.touched.order &&
                          formik.touched.order[index] &&
                          formik.errors.order &&
                          formik.errors.order[index]
                        }
                        xs={9}
                        sm={9}
                        md={9}
                        lg={9}
                      />
                    </Grid>

                    <Grid item xs={3} sm={3} md={3} lg={3}>
                      {console.log(
                        formik.errors.order && formik.errors.order[index]
                      )}
                      <Button
                        sx={{
                          height:
                            formik.touched.order &&
                            formik.touched.order[index] &&
                            !formik.values.order[index]
                              ? "75%"
                              : "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        variant="outlined"
                        onClick={() => handleRemoveOrderItem(index)}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button variant="contained" onClick={handleAddOrderItem}>
                  Add Order
                </Button>
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

export default AsbezaOrderBranchForm;
