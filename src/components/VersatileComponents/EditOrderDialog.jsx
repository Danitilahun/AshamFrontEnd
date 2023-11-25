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
import { firestore } from "../../services/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useLocation, useParams } from "react-router-dom";
const EditDialog = ({
  open,
  onClose,
  isSubmitting,
  onSubmit,
  editFormValues,
  setEditFormValues,
  type,
}) => {
  const [branches, setBranches] = useState([]);
  const theme = useTheme();
  const param = useParams();
  const [deliveryman, setDeliveryman] = useState([]);
  const { pathname } = useLocation();
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

  const branchInfo = branches?.map((item) => [item.name, item.id]);

  useEffect(() => {
    if (!pathname.startsWith("/service")) {
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
  }, [editFormValues.branch]);

  const handleInputChange = (field, value) => {
    setEditFormValues((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
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
              {pathname.startsWith("/service") && (
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
              )}

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

              {type === "Card" ? (
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    label="Amount Birr"
                    type="number"
                    value={editFormValues.amountBirr}
                    onChange={(e) =>
                      handleInputChange("amountBirr", e.target.value)
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
              ) : null}

              {type === "Water" ? (
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    label="Customer Key"
                    value={editFormValues.customerKey}
                    onChange={(e) =>
                      handleInputChange("customerKey", e.target.value)
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
              ) : null}
              {type === "Water" ? (
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    label="Bill PayerName"
                    value={editFormValues.billPayerName}
                    onChange={(e) =>
                      handleInputChange("billPayerName", e.target.value)
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
              ) : null}
              {type === "Wifi" ? (
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    label="Account Number"
                    value={editFormValues.accountNumber}
                    onChange={(e) =>
                      handleInputChange("accountNumber", e.target.value)
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
              ) : null}
              {type === "Wifi" ? (
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    label="Owner Name"
                    value={editFormValues.ownerName}
                    onChange={(e) =>
                      handleInputChange("ownerName", e.target.value)
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
              ) : null}
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

export default EditDialog;
