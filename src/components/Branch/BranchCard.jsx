import React, { useState } from "react";
import { Card, useTheme } from "@mui/material";

import { useAuth } from "../../contexts/AuthContext";
import updateBranch from "../../api/services/Branch/update.branch";
import { useSnackbar } from "../../contexts/InfoContext";
import { useNavigate } from "react-router-dom";
import { useBranch } from "../../contexts/BranchContext";
import { useDispatch } from "react-redux";
import { setSelectedItem } from "../../store/itemDetailsSlice";
import ConfirmationDialog from "../VersatileComponents/ConfirmationDialog";
import LoadingSpinner from "../VersatileComponents/LoadingSpinner";
import BranchCardHeader from "./BranchCardHeader";
import BranchCardContent from "./BranchCardContent";
import EditBranchForm from "./editBranchForm/editBranchForm";
import deleteBranch from "../../api/branch/deleteBranch";

const updateFields = (targetObject, sourceObject) => {
  // Loop through the keys in the source object
  for (const key in sourceObject) {
    // Check if the key exists in both objects
    if (key in targetObject) {
      // Update the value in the target object
      targetObject[key] = sourceObject[key];
    }
  }
};
const typographyStyles = {
  cursor: "pointer",
  transition: "font-size 0.2s ease-in-out",
  "&:hover": {
    fontSize: "1.2rem",
  },
};

const BranchCard = ({ branchData }) => {
  const [showMore, setShowMore] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [operation, setOperation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();
  const { changeBranch, changeBranchName, changeActiveness } = useBranch();
  const dispatch = useDispatch();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const handleItemClick = (item) => {
    // Dispatch the setSelectedItem action with both itemId and item
    dispatch(setSelectedItem({ itemId: item.id, item }));
  };

  console.log("branch data", branchData.active);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteIconClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleCardClick = async (event) => {
    event.preventDefault();
    handleItemClick(branchData);
    const idTokenResult = await user.getIdTokenResult();
    localStorage.setItem("userData", JSON.stringify({}));
    localStorage.setItem("userData", JSON.stringify(branchData));
    changeActiveness(branchData.active);
    changeBranchName(branchData.name);
    changeBranch(branchData.id);
    if (idTokenResult.claims.superAdmin) {
      navigate(`/deliveryguy/${branchData.id}`);
    } else {
      navigate(`/genzeb/salary/${branchData.id}`);
    }
  };

  const [editFormValues, setEditFormValues] = useState();

  // console.log("branch info", branchData);
  const handleEdit = (branch) => {
    setIsEditDialogOpen(true);
    console.log("branch info", branch);
    setEditFormValues(branch);
  };

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSeeMore = () => {
    setShowMore(!showMore);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteConfirmed = async () => {
    handleDialogClose();
    setOperation("delete");
    setIsSubmitting(true);
    try {
      const res = await deleteBranch(user, branchData.id);
      openSnackbar(res.data.message, "success");
      setIsSubmitting(false);
    } catch (error) {
      openSnackbar(
        error.response.data.message,
        error.response.data.type ? error.response.data.type : "error"
      );
    }
    handleMenuClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOperation("edit");
    setIsSubmitting(true);
    try {
      // console.log(branchData);
      // console.log(editFormValues);
      branchData.diff =
        parseInt(editFormValues.budget) - parseInt(branchData.budget);
      updateFields(branchData, editFormValues);
      // console.log(branchData);
      // console.log(branchData);
      await updateBranch(branchData.id, user, branchData);
      openSnackbar(`Branch updated successful!`, "success");
      setIsSubmitting(false);
      handleCloseForm();
    } catch (error) {
      openSnackbar(`Error occurred while performing updating Branch.`, "error");
    }
  };

  return (
    <>
      <LoadingSpinner isSubmitting={isSubmitting} />
      <Card
        sx={{
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
          color: theme.palette.secondary[700],
          marginTop: "1rem",
        }}
      >
        <BranchCardHeader
          anchorEl={anchorEl}
          branchData={branchData}
          handleMenuOpen={handleMenuOpen}
          handleMenuClose={handleMenuClose}
          handleCardClick={handleCardClick}
          handleEdit={handleEdit}
          handleDeleteIconClick={handleDeleteIconClick}
          showMore={showMore}
          typographyStyles={typographyStyles}
        />
        <BranchCardContent
          branchData={branchData}
          showMore={showMore}
          handleSeeMore={handleSeeMore}
        />
      </Card>

      {isEditDialogOpen && (
        <EditBranchForm
          branch={branchData}
          isEditDialogOpen={isEditDialogOpen} // Pass the state
          closeEditDialog={() => setIsEditDialogOpen(false)} // Pass the close function
        />
      )}

      <ConfirmationDialog
        open={openDialog}
        handleDialogClose={handleDialogClose}
        handleConfirmed={handleDeleteConfirmed}
        message={
          "Are you sure you want to delete this Branch? This action will also delete all associated information of the branch."
        }
        title={"Confirm Branch Deletion"}
      />
    </>
  );
};

export default BranchCard;
