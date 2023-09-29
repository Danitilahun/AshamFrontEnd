import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Menu,
  MenuItem,
  IconButton,
  CardHeader,
  useTheme,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogContentText,
  TextField,
  DialogActions,
  Avatar,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useAuth } from "../../contexts/AuthContext";
import CustomEllipsisTextField from "../CustomComponents/CustomEllipsisTextField";
import getHumanReadableDate from "../../utils/humanReadableDate";
import { useSnackbar } from "../../contexts/InfoContext";
import { useNavigate, useParams } from "react-router-dom";
import EditAsbezaDialog from "./EditAsbezaDialog";
import updateOrder from "../../api/services/Order/update.order";
import setActiveness from "../../api/services/DeliveryGuy/setActiveness";
import deleteOrder from "../../api/services/Order/delete.order";
import FlexBetween from "../VersatileComponents/FlexBetween";
import changeStatus from "../../api/services/Order/changeStatus";
import AddProfit from "../../api/services/Order/AddProfit";
import getInternationalDate from "../../utils/getDate";
import getNumberOfDocumentsInCollection from "../../api/utils/getNumberOfDocument";
import InfoIcon from "@mui/icons-material/Info";
import useUserClaims from "../../hooks/useUserClaims";
import LoadingSpinner from "../VersatileComponents/LoadingSpinner";
import ConfirmationDialog from "../VersatileComponents/ConfirmationDialog";
import AsbezaCardHeader from "./AsbezaCardHeader";
import AsbezaCardContent from "./AsbezaCardContent";
import { SpinnerContext } from "../../contexts/SpinnerContext";

const AsbezaCard = ({ asbezaData, userType }) => {
  const { user } = useAuth();
  const userClaims = useUserClaims(user);
  const [showMore, setShowMore] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();
  const param = useParams();
  console.log("asbezaData", asbezaData);
  const navigate = useNavigate();
  const [openDialog2, setOpenDialog2] = useState(false);
  const handleDeleteIconClick2 = () => {
    handleCloseForm();
    setOpenDialog2(true);
  };

  const handleDialogClose2 = () => {
    setOpenDialog2(false);
  };

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
      console.log("asbezaId", asbezaData.id, "edited", editFormValues);
      const formData = editFormValues;
      const activeData = {
        deliveryManId: formData.deliveryguyId,
        deliveryGuyName: formData.deliveryguyName,
        branchId: formData.branch,
        active: false,
      };
      console.log("activeness", activeData);
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
  const [profit, setProfit] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleProfitSubmit = async (event) => {
    // Handle form submission here (e.g., save the profit to the database).
    console.log("Profit:", profit);
    event.preventDefault();
    setIsSubmitting(true);
    handleClose();
    handleDialogClose2();
    handleCloseForm();
    const date = getInternationalDate();
    const count = await getNumberOfDocumentsInCollection(
      "sheets",
      "branchId",
      asbezaData.branch
    );

    try {
      const amount = profit === "" ? 0 : profit;
      const profitData = {
        profit: parseInt(amount),
        date: date,
        branchId: asbezaData.branch,
        deliveryguyId: asbezaData.deliveryguyId,
        sheetNumber: count,
      };
      await AddProfit(user, "Asbeza", asbezaData.id, profitData);
      await changeStatus(user, "Asbeza", asbezaData.id, "Completed"); // Pass the friend's name and the new status as parameters to the changeStatus function.
      openSnackbar(`Status updated successfully to Completed!`, "success");
    } catch (error) {
      openSnackbar(`Error occurred while performing updating Asbeza.`, "error");
    }
    setIsSubmitting(false);
  };

  const handleProfitChange = (event) => {
    setProfit(event.target.value);
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
