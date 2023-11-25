import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  DialogActions,
} from "@mui/material";
import fetchData from "../../api/services/Users/getUser";
import { useSnackbar } from "../../contexts/InfoContext";
import setActiveness from "../../api/services/DeliveryGuy/setActiveness";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation, useParams } from "react-router-dom";
import createOrder from "../../api/services/Order/create.order";
import FlexBetween from "../VersatileComponents/FlexBetween";
import LoadingSpinner from "../VersatileComponents/LoadingSpinner";
import FormTextField from "../VersatileComponents/FormTextField";
import { firestore } from "../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
const AsbezaOrderForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [branches, setBranches] = useState([]);
  const [deliveryGuy, setDeliveryGuy] = useState([]);
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const param = useParams();
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const { pathname } = useLocation();
  const [deliveryman, setDeliveryman] = useState([]);
  let branchName = "";
  let activeTable = "";
  const storedData = localStorage.getItem("userData");
  if (storedData) {
    const userData = JSON.parse(storedData);
    branchName = userData ? userData.name : "";
    activeTable = userData ? userData.activeTable : "";
  }
  const handleOpen = () => {
    setShowForm(true);
  };

  useEffect(() => {
    const unsubscribe = fetchData("branches", setBranches);
    return () => unsubscribe();
  }, []);

  const branchInfo = branches?.map((item) => [
    item.name,
    item.id,
    item.activeTable,
  ]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    branch: "",
    blockHouse: "",
    deliveryguyId: "",
    additionalInfo: "",
    branchName: "",
    deliveryguyName: "",
    activeTable: "",
    order: [],
  });

  useEffect(() => {
    if (pathname.startsWith("/asbeza")) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        branch: param.id,
        branchName: branchName,
        activeTable: activeTable,
      }));
    }
  }, [pathname, param.id]);

  useEffect(() => {
    if (!formData.branch) {
      return;
    }
    const worksRef = doc(collection(firestore, "branches"), formData.branch);
    const unsubscribe = onSnapshot(worksRef, (doc) => {
      if (doc.exists()) {
        const inputArray = doc.data().worker;
        const deliveryMan = inputArray.reduce((accumulator, obj) => {
          if (obj.role === "DeliveryGuy") {
            accumulator.push([obj.name, obj.id]);
          }
          return accumulator;
        }, []);
        setDeliveryman(deliveryMan);
      }
    });
    return () => unsubscribe();
  }, [formData.branch]);

  useEffect(() => {
    if (formData.branch && !formData.activeTable) {
      openSnackbar(
        `${formData.branchName} branch do not have daily table today.So you can't create order.Please inform the branch to create daily table in there sheet.`,
        "info"
      );
    }
  }, [formData.branch, formData.activeTable]);
  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      name: "",
      phone: "",
      branch: "",
      deliveryguyId: "",
      deliveryguyName: "",
      blockHouse: "",
      additionalInfo: "",
      branchName: "",
      order: [],
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleAddOrderItem = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      order: [...prevFormData.order, ""],
    }));
  };

  const handleOrderInputChange = (index, value) => {
    setFormData((prevFormData) => {
      const newOrder = [...prevFormData.order];
      newOrder[index] = value;
      return {
        ...prevFormData,
        order: newOrder,
      };
    });
  };

  const handleRemoveOrderItem = (index) => {
    setFormData((prevFormData) => {
      const newOrder = [...prevFormData.order];
      newOrder.splice(index, 1);
      return {
        ...prevFormData,
        order: newOrder,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const activeData = {
        deliveryManId: formData.deliveryguyId,
        deliveryGuyName: formData.deliveryguyName,
        branchId: formData.branch,
        active: false,
      };
      formData.type = "Asbeza";
      formData.callcenterId = param.id;
      formData.status = "new order";
      formData.createdDate = new Date();
      formData.profit = 0;
      formData.blockHouse = formData.blockHouse.toUpperCase();
      if (!formData.activeTable) {
        openSnackbar(`This branch do not have Daily table.`, "info");
      } else {
        const res = await createOrder(formData, user);
        openSnackbar(`Asbeza order successfully created!`, "success");

        handleCloseForm();
        setIsSubmitting(false);
        await setActiveness(activeData, user);
        activeData.active = true;
        await setActiveness(activeData, user);
      }
    } catch (error) {
      openSnackbar(`Error occurred while performing order change`, "error");
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create new Asbeza Order
      </Button>

      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>New Asbeza Order</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <FormTextField
                label="Name"
                value={formData.name}
                onChange={(value) => handleInputChange("name", value)}
                fullWidth
                required
                theme={theme}
              />

              <FormTextField
                label="Phone"
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                fullWidth
                required
                theme={theme}
              />

              {!pathname.startsWith("/asbeza") && (
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    select
                    name="branch"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.branch}
                    onChange={(e) => {
                      const branchId = e.target.value;
                      const branchName =
                        branchInfo.find(
                          (branch) => branch[1] === branchId
                        )?.[0] || ""; // Find the branch name using the branchId
                      const branchactiveTable =
                        branchInfo.find(
                          (branch) => branch[1] === branchId
                        )?.[2] || ""; // Find the branch name using the branchId
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        branch: branchId,
                        branchName: branchName,
                        activeTable: branchactiveTable,
                      }));
                    }}
                    label="Branch"
                  >
                    <MenuItem value="">Select Branch</MenuItem>
                    {branchInfo?.map((branch) => (
                      <MenuItem key={branch[1]} value={branch[1]}>
                        {branch[0]}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              <FormTextField
                label="Block/House"
                value={formData.blockHouse}
                onChange={(value) => handleInputChange("blockHouse", value)}
                fullWidth
                required
                theme={theme}
              />

              <FormTextField
                label="Additional Info"
                value={formData.additionalInfo}
                onChange={(value) => handleInputChange("additionalInfo", value)}
                fullWidth
                required
                theme={theme}
              />
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  select
                  name="deliveryguyId"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.deliveryguyId}
                  onChange={(e) => {
                    const branchId = e.target.value;
                    const branchName =
                      deliveryman.find(
                        (branch) => branch[1] === branchId
                      )?.[0] || ""; // Find the branch name using the branchId
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      deliveryguyId: branchId,
                      deliveryguyName: branchName,
                    }));
                  }}
                  label="Delivery guy"
                >
                  <MenuItem value="">Select Delivery Guy</MenuItem>
                  {deliveryman?.map((branch) => (
                    <MenuItem key={branch[1]} value={branch[1]}>
                      {branch[0]}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {formData?.order?.map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <FlexBetween>
                    <TextField
                      label={`Order ${index + 1}`}
                      value={item}
                      onChange={(e) =>
                        handleOrderInputChange(index, e.target.value)
                      }
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          marginTop: "8px",
                          color: theme.palette.secondary[100],
                        },
                      }}
                    />

                    <Button
                      variant="outlined"
                      onClick={() => handleRemoveOrderItem(index)}
                      sx={{
                        marginLeft: theme.spacing(5),
                        color: theme.palette.secondary[100],
                        "&:hover": {
                          backgroundColor: theme.palette.background.alt,
                        },
                      }}
                    >
                      Remove
                    </Button>
                  </FlexBetween>
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
                <DialogActions>
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
                    // onClick={handleSubmit}
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
export default AsbezaOrderForm;
