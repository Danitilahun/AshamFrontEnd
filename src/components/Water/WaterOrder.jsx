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
  CircularProgress,
} from "@mui/material";
import fetchData from "../../api/services/Users/getUser";
import { useSnackbar } from "../../contexts/InfoContext";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation, useParams } from "react-router-dom";
import createOrder from "../../api/services/Order/create.order";
import setActiveness from "../../api/services/DeliveryGuy/setActiveness";
import LoadingSpinner from "../VersatileComponents/LoadingSpinner";
import FormTextField from "../VersatileComponents/FormTextField";
import { firestore } from "../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
const WaterOrderForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [branches, setBranches] = useState([]);
  const [deliveryGuy, setDeliveryGuy] = useState([]);
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const param = useParams();
  const {isSubmitting, setIsSubmitting} = useContext(SpinnerContext);
  console.log("param", param);
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
  const handleCloseForm = () => {
    setShowForm(false);
  };
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
    billPayerName: "",
    customerKey: "",
    blockHouse: "",
    branch: "",
    branchName: "",
    deliveryguyId: "",
    deliveryguyName: "",
    activeTable: "",
  });

  useEffect(() => {
    if (pathname.startsWith("/water")) {
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
        console.log("Document data:", doc.data());
        const inputArray = doc.data().worker;
        const deliveryMan = inputArray.reduce((accumulator, obj) => {
          if (obj.role === "DeliveryGuy") {
            accumulator.push([obj.name, obj.id]);
          }
          return accumulator;
        }, []);
        console.log("deliveryMan", deliveryMan);
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
  console.log(formData);

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    // Send formData to the backend
    event.preventDefault();
    setIsSubmitting(true);
    console.log(formData);
    try {
      const activeData = {
        deliveryManId: formData.deliveryguyId,
        deliveryGuyName: formData.deliveryguyName,
        branchId: formData.branch,
        active: false,
      };
      console.log("activeness", activeData);
      formData.type = "Water";
      formData.callcenterId = param.id;
      formData.status = "new order";
      formData.createdDate = new Date();
      formData.blockHouse = formData.blockHouse.toUpperCase();
      if (!formData.activeTable) {
        openSnackbar(`This branch do not have Daily table.`, "info");
      } else {
        console.log("formData", formData);
        await createOrder(formData, user);
        openSnackbar(`Water order successfully created!`, "success");
        setFormData({
          name: "",
          phone: "",
          branch: "",
          branchName: "",
          deliveryguyId: "",
          deliveryguyName: "",
          blockHouse: "",
          customerKey: "",
          billPayerName: "",
        });
        handleCloseForm();
        setIsSubmitting(false);
        await setActiveness(activeData, user);
        activeData.active = true;
        await setActiveness(activeData, user);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      openSnackbar(`Error occurred while performing order change`, "error");
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create new Water Order
      </Button>
      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>New Water Order</DialogTitle>
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

              {!pathname.startsWith("/water") && (
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
                label="Customer Key"
                value={formData.customerKey}
                onChange={(value) => handleInputChange("customerKey", value)}
                fullWidth
                required
                theme={theme}
              />

              <FormTextField
                label="Bill Payer Name"
                value={formData.billPayerName}
                onChange={(value) => handleInputChange("billPayerName", value)}
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
            </Grid>

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
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WaterOrderForm;
