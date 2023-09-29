import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import createBranch from "../../api/services/Branch/create.branch";
import CustomTextField from "../CustomComponents/CustomTextField";
import { useSnackbar } from "../../contexts/InfoContext";
import { useTheme } from "@emotion/react";
import { SpinnerContext } from "../../contexts/SpinnerContext";

const BranchForm = ({ type }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();
  const {isSubmitting, setIsSubmitting} = useContext(SpinnerContext);

  const [userClaims, setUserClaims] = useState({});
  // ... (other states)

  // Use useEffect to fetch idTokenResult when the component mounts
  useEffect(() => {
    async function fetchUserClaims() {
      try {
        const idTokenResult = await user.getIdTokenResult();
        setUserClaims(idTokenResult.claims);
      } catch (error) {
        console.log("Error fetching user claims:", error);
      }
    }
    fetchUserClaims();
  }, [user]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = event.target.elements;
    // Create a JSON object with non-null properties
    const jsonFormData = {};
    for (let i = 0; i < formData.length; i++) {
      const element = formData[i];
      // console.log("type", element.type, element.name);

      if (element.name && element.value.trim() !== "") {
        const value =
          element.type === "number"
            ? element.value.trim() !== ""
              ? Number(element.value)
              : 0
            : element.value;
        jsonFormData[element.name] = value;
      } else if (element.name) {
        if (element.type === "number") {
          jsonFormData[element.name] = 0;
        } else {
          jsonFormData[element.name] = "";
        }
      }
    }

    // Log the JSON object
    jsonFormData["numberofworker"] = 0;
    jsonFormData["manager"] = "";
    jsonFormData["activeTable"] = "";
    jsonFormData["activeSheet"] = "";
    jsonFormData["active"] = "";
    jsonFormData["openingDate"] = new Date().toISOString();
    console.log("-----------the file-----------", jsonFormData);

    // Create the branch
    try {
      console.log("file", jsonFormData);
      await createBranch(jsonFormData, user);

      openSnackbar(`branch created successful!`, "success");
      handleClose();
    } catch (error) {
      console.log("error occurred while creating branch", error.message);
      openSnackbar(error.message, "error");
    }
    setIsSubmitting(false);
    // Close the dialog
  };

  return (
    <div>
      {userClaims.superAdmin ? (
        <div>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Create new {type}
          </Button>
          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>New Branch</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <CustomTextField name="name" label="Name" />
                  <CustomTextField name="address" label="Address" />
                  <CustomTextField name="phone" label="Phone" />

                  <CustomTextField
                    name="ethioTelBill"
                    label="Ethio Tel Bill"
                    type={"number"}
                  />
                  <CustomTextField
                    name="houseKeeper"
                    label="House Keeper"
                    type={"number"}
                  />
                  <CustomTextField
                    name="cleanerSalary"
                    label="Cleaner Salary"
                    type={"number"}
                  />
                  <CustomTextField name="wifi" label="Wifi" type={"number"} />
                  <CustomTextField
                    name="houseRent"
                    label="House Rent"
                    type={"number"}
                  />
                  <CustomTextField
                    name="account"
                    label="Account"
                    type={"number"}
                  />
                  <CustomTextField
                    name="budget"
                    label="Budget"
                    type={"number"}
                  />
                  <CustomTextField
                    name="taxPersentage"
                    label="Tax persentage"
                    type={"number"}
                  />
                  <Grid item xs={12} sx={{ mt: 3 }}>
                    Other Expenses
                  </Grid>

                  <CustomTextField
                    name="ExpenseOneName"
                    label="Expense One Name"
                    isInputRequired={false}
                  />

                  <CustomTextField
                    name="ExpenseOneAmount"
                    label="Expense One Amount"
                    type={"number"}
                    isInputRequired={false}
                  />

                  <CustomTextField
                    name="ExpenseTwoName"
                    label="Expense Two Name"
                    isInputRequired={false}
                  />

                  <CustomTextField
                    name="ExpenseTwoAmount"
                    label="Expense Two Amount"
                    type={"number"}
                    isInputRequired={false}
                  />

                  <CustomTextField
                    name="ExpenseThreeName"
                    label="Expense Three Name"
                    isInputRequired={false}
                  />

                  <CustomTextField
                    name="ExpenseThreeAmount"
                    label="Expense Three Amount"
                    type={"number"}
                    isInputRequired={false}
                  />
                </Grid>
                <DialogActions>
                  <Button
                    variant="contained"
                    onClick={handleClose}
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
                    variant="contained"
                    type="submit"
                    backgroundColor={theme.palette.background.alt}
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
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default BranchForm;
