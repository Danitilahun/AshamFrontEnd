import React, { useContext, useState } from "react";
import { Card, useTheme } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import getHumanReadableDate from "../../utils/humanReadableDate";
import { useSnackbar } from "../../contexts/InfoContext";
import { useParams } from "react-router-dom";
import EditAsbezaDialog from "./EditAsbezaDialog";
import updateOrder from "../../api/services/Order/update.order";
import setActiveness from "../../api/services/DeliveryGuy/setActiveness";
import deleteOrder from "../../api/services/Order/delete.order";
import changeStatus from "../../api/services/Order/changeStatus";
import ConfirmationDialog from "../VersatileComponents/ConfirmationDialog";
import AsbezaCardHeader from "./AsbezaCardHeader";
import AsbezaCardContent from "./AsbezaCardContent";
import { SpinnerContext } from "../../contexts/SpinnerContext";

const AsbezaCard = ({ asbezaData, userType }) => {
  const { user } = useAuth();
  const [showMore, setShowMore] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { setIsSubmitting } = useContext(SpinnerContext);
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();
  const param = useParams();

  // Use useEffect to fetch idTokenResult when the component mounts
  const handleDeleteIconClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const [editFormValues, setEditFormValues] = useState({
    name: "",
    phone: "",
    branch: "",
    blockHouse: "",
    deliveryguyId: "",
    deliveryguyName: "",
    additionalInfo: "",
    branchName: "",
    order: [],
  });

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleEdit = (asbeza) => {
    if (status == "new order") {
      setEditFormValues({
        branch: asbeza.branch,
        name: asbeza.name,
        blockHouse: asbeza.blockHouse,
        phone: asbeza.phone,
        branchName: asbeza.branchName,
        deliveryguyId: asbeza.deliveryguyId,
        deliveryguyName: asbeza.deliveryguyName,
        additionalInfo: asbeza.additionalInfo,
        order: asbeza.order,
      });
      handleOpenForm();
    } else {
      openSnackbar(`You can't edit since it is already ${status}.`, "info");
    }
  };

  const handleNew = (asbeza) => {
    if (status == "Completed") {
      setEditFormValues({
        branch: "",
        name: asbeza.name,
        blockHouse: asbeza.blockHouse,
        phone: asbeza.phone,
        branchName: "",
        deliveryguyId: "",
        deliveryguyName: "",
        additionalInfo: "",
        order: [],
      });
      handleOpenForm();
    } else {
      openSnackbar(`You can't edit since it is already ${status}.`, "info");
    }
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
    setIsSubmitting(true);
    try {
      await deleteOrder(user, asbezaData.id, "Asbeza");
      openSnackbar(`Asbeza deleted successfully!`, "success");
    } catch (error) {
      openSnackbar(`Error occurred while performing deleting Asbeza.`, "error");
    }
    handleMenuClose();
    setIsSubmitting(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    // handleDialogClose2();

    try {
      const formData = editFormValues;
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
      formData.type = "Asbeza";
      await updateOrder(asbezaData.id, user, formData);
      openSnackbar(`Asbeza updated successful!`, "success");
      handleCloseForm();
      setIsSubmitting(false);
      await setActiveness(activeData, user);
      activeData.active = true;
      await setActiveness(activeData, user);
    } catch (error) {
      openSnackbar(`Error occurred while performing updating Asbeza.`, "error");
    }
    setIsSubmitting(false);
  };

  const {
    name,
    blockHouse,
    phone,
    branchName,
    deliveryguyName,
    additionalInfo,
    order,
    createdDate,
    status,
  } = asbezaData;
  const humanReadableDate = getHumanReadableDate(createdDate);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClick = async () => {
    setIsSubmitting(true);
    if (userType === "Branch") {
      try {
        if (status === "new order") {
          // Update the status to 'Assigned'
          await changeStatus(user, "Asbeza", asbezaData.id, "Assigned");
          openSnackbar(`Status updated successfully to Assigned!`, "success"); // Pass the friend's name and the new status as parameters to the changeStatus function.
        } else if (status === "Assigned") {
          handleClickOpen();
          // Update the status to 'Completed'
        }
      } catch (error) {
        openSnackbar(
          `Error occurred while performing updating Asbeza.`,
          "error"
        );
      }
    }
    setIsSubmitting(false);
  };
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
        <AsbezaCardHeader
          {...{
            theme,
            name,
            status,
            userType,
            asbezaData,
            handleMenuOpen,
            handleMenuClose,
            handleEdit,
            handleNew,
            handleDeleteIconClick,
            handleClick,
            humanReadableDate,
            anchorEl,
          }}
        />

        <AsbezaCardContent
          {...{
            name,
            blockHouse,
            phone,
            branchName,
            deliveryguyName,
            additionalInfo,
            showMore,
            handleSeeMore,
            order,
            theme,
          }}
        />
      </Card>
      {showForm && (
        <EditAsbezaDialog
          open={showForm}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          editFormValues={editFormValues}
          setEditFormValues={setEditFormValues}
        />
      )}

      <ConfirmationDialog
        open={openDialog}
        handleDialogClose={handleDialogClose}
        handleConfirmed={handleDeleteConfirmed}
        message={"Are you sure you want to delete this Asbeza order?"}
        title={"Confirm asbeza deletion"}
      />
    </>
  );
};

export default AsbezaCard;
