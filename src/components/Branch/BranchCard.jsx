import React, { useContext, useState } from "react";
import { Card, useTheme } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import updateBranch from "../../api/services/Branch/update.branch";
import { useSnackbar } from "../../contexts/InfoContext";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmationDialog from "../VersatileComponents/ConfirmationDialog";
import BranchCardHeader from "./BranchCardHeader";
import BranchCardContent from "./BranchCardContent";
import EditBranchForm from "./editBranchForm/editBranchForm";
import deleteBranch from "../../api/branch/deleteBranch";
import { SpinnerContext } from "../../contexts/SpinnerContext";
import useDocumentById from "../../hooks/useDocumentById";

const updateFields = (targetObject, sourceObject) => {
  for (const key in sourceObject) {
    if (key in targetObject) {
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
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteIconClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const { pathname } = useLocation();
  const handleCardClick = async (event) => {
    event.preventDefault();
    // handleItemClick(branchData);
    const idTokenResult = await user.getIdTokenResult();
    localStorage.setItem("userData", JSON.stringify({}));
    localStorage.setItem("userData", JSON.stringify(branchData));

    if (
      idTokenResult.claims.superAdmin &&
      pathname.startsWith("/mainFinance/branches")
    ) {
      navigate(`/genzeb/salary/${branchData.id}`);
    } else if (idTokenResult.claims.superAdmin) {
      navigate(`/deliveryguy/${branchData.id}`);
    } else {
      navigate(`/genzeb/salary/${branchData.id}`);
    }
  };

  const [editFormValues, setEditFormValues] = useState();

  const handleEdit = (branch) => {
    setIsEditDialogOpen(true);
    setEditFormValues(branch);
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
    handleMenuClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOperation("edit");
    setIsSubmitting(true);
    try {
      branchData.diff =
        parseInt(editFormValues.budget) - parseInt(branchData.budget);
      updateFields(branchData, editFormValues);
      await updateBranch(branchData.id, user, branchData);
      openSnackbar(`Branch updated successful!`, "success");
      setIsSubmitting(false);
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
  };

  const { documentData: budget } = useDocumentById("Budget", branchData.id);
  const { documentData: status } = useDocumentById("Status", branchData.active);

  branchData.status = status || {};
  branchData.budgets = budget;

  return (
    <>
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
