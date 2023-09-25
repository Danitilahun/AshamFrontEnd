import React, { useEffect, useState } from "react";
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
import { useAuth } from "../../contexts/AuthContext";
import { useLocation, useParams } from "react-router-dom";
import FlexBetween from "../VersatileComponents/FlexBetween";
import { firestore } from "../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
const EditAsbezaDialog = ({
  open,
  onClose,
  isSubmitting,
  onSubmit,
  editFormValues,
  setEditFormValues,
}) => {
  const [branches, setBranches] = useState([]);
  const [deliveryGuy, setDeliveryGuy] = useState([]);
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();
  const param = useParams();
  const { pathname } = useLocation();
  const [deliveryman, setDeliveryman] = useState([]);
  let branchName = "";
  const storedData = localStorage.getItem("userData");
  if (storedData) {
    const userData = JSON.parse(storedData);
    branchName = userData ? userData.name : "";
  }

  useEffect(() => {
    const unsubscribe = fetchData("branches", setBranches);
    return () => unsubscribe();
  }, []);

  console.log("deliveryGuy", deliveryGuy);
  const branchInfo = branches?.map((item) => [item.name, item.id]);

  useEffect(() => {
    if (pathname.startsWith("/asbeza")) {
      setEditFormValues((prevFormData) => ({
        ...prevFormData,
        branch: param.id,
        branchName: branchName,
      }));
    }
  }, [pathname, param.id]);

  useEffect(() => {
    if (!editFormValues.branch) {
      return;
    }
    const worksRef = doc(
      collection(firestore, "branches"),
      editFormValues.branch
    );
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
  }, [editFormValues.branch]);

  const handleInputChange = (field, value) => {
    setEditFormValues((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleAddOrderItem = () => {
    setEditFormValues((prevFormData) => ({
      ...prevFormData,
      order: [...prevFormData.order, ""],
    }));
  };

  const handleOrderInputChange = (index, value) => {
    setEditFormValues((prevFormData) => {
      const newOrder = [...prevFormData.order];
      newOrder[index] = value;
      return {
        ...prevFormData,
        order: newOrder,
      };
    });
  };

  // useEffect(() => {
  //   if (editFormValues.branch && !editFormValues.activeTable) {
  //     openSnackbar(
  //       `${editFormValues.branchName} branch do not have daily table today.So you can't create order.Please inform the branch to create daily table in there sheet.`,
  //       "info"
  //     );
  //   }
  // }, [editFormValues.branch, editFormValues.activeTable]);

  const handleRemoveOrderItem = (index) => {
    setEditFormValues((prevFormData) => {
      const newOrder = [...prevFormData.order];
      newOrder.splice(index, 1); // Remove the order item at the given index
      return {
        ...prevFormData,
        order: newOrder,
      };
    });
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>New Asbeza Order</DialogTitle>
        <DialogContent>
          <form onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Name"
                  value={editFormValues.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      marginTop: "8px",
                      color: theme.palette.secondary[100],
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Phone"
                  value={editFormValues.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      marginTop: "8px",
                      color: theme.palette.secondary[100],
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  select
                  name="branch"
                  variant="outlined"
                  fullWidth
                  required
                  value={editFormValues.branch}
                  onChange={(e) => {
                    const branchId = e.target.value;
                    const branchName =
                      branchInfo.find(
                        (branch) => branch[1] === branchId
                      )?.[0] || ""; // Find the branch name using the branchId
                    setEditFormValues((prevFormData) => ({
                      ...prevFormData,
                      branch: branchId,
                      branchName: branchName,
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

              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Block/House"
                  value={editFormValues.blockHouse}
                  onChange={(e) =>
                    handleInputChange("blockHouse", e.target.value)
                  }
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      marginTop: "8px",
                      color: theme.palette.secondary[100],
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Additional Info"
                  value={editFormValues.additionalInfo}
                  onChange={(e) =>
                    handleInputChange("additionalInfo", e.target.value)
                  }
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      marginTop: "8px",
                      color: theme.palette.secondary[100],
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  select
                  name="deliveryguyId"
                  variant="outlined"
                  fullWidth
                  required
                  value={editFormValues.deliveryguyId}
                  onChange={(e) => {
                    const branchId = e.target.value;
                    const branchName =
                      deliveryman.find(
                        (branch) => branch[1] === branchId
                      )?.[0] || ""; // Find the branch name using the branchId
                    setEditFormValues((prevFormData) => ({
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
              {editFormValues?.order?.map((item, index) => (
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
                    onClick={onClose}
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
                    // onClick={onSubmit}
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

export default EditAsbezaDialog;
