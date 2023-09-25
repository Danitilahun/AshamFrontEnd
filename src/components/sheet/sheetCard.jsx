import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { green } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { useSnackbar } from "../../contexts/InfoContext";
import { useAuth } from "../../contexts/AuthContext";
import getHumanReadableDate from "../../utils/humanReadableDate";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useBranch } from "../../contexts/BranchContext";
import { useState } from "react";
import LoadingSpinner from "../VersatileComponents/LoadingSpinner";
import ConfirmationDialog from "../VersatileComponents/ConfirmationDialog";
import deleteSheet from "../../api/sheet/delete";
import useUserClaims from "../../hooks/useUserClaims";

const SheetCard = ({ sheetInfo }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { changesheetName, changetableDate } = useBranch();
  const [openDialog, setOpenDialog] = React.useState(false);
  const userClaims = useUserClaims(user);
  const handleDeleteIconClick = () => {
    handleMenuClose();
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const theme = useTheme();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    handleDialogClose();
    try {
      await deleteSheet(user, sheetInfo.id);
      openSnackbar(`Sheet deleted successfully!`, "success");
    } catch (error) {
      console.log(error);
      openSnackbar(`Error occurred while performing deleting sheet.`, "error");
    }
    setIsSubmitting(false);
  };

  const humanReadableDate = getHumanReadableDate(sheetInfo.realDate);

  const handleCardClick = (event) => {
    event.preventDefault();
    changesheetName(sheetInfo.name);
    changetableDate(sheetInfo.tableDate);
    navigate(`/table/${params.id}/${sheetInfo.id}`);
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
          // maxWidth: 280,
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: green[300] }} aria-label="recipe">
              {sheetInfo.sheetNumber}
            </Avatar>
          }
          action={
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <IconButton
                onClick={handleMenuOpen}
                style={{ color: theme.palette.secondary[100] }}
              >
                <MoreVertIcon />
              </IconButton>
              {userClaims.superAdmin ? (
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                >
                  <MenuItem onClick={() => handleDeleteIconClick()}>
                    Delete
                  </MenuItem>
                </Menu>
              ) : null}
            </div>
          }
          title={
            <Typography
              variant="h6"
              fontSize={18}
              sx={{ color: "text.secondary" }}
            >
              {sheetInfo.name}
            </Typography>
          }
          subheader={humanReadableDate}
        />
        <div onClick={handleCardClick}>
          <CardMedia
            component="img"
            height="100%"
            image="/assets/sheet.png"
            alt="Sheet"
            style={{ cursor: "pointer" }}
          />
        </div>

        <ConfirmationDialog
          open={openDialog}
          handleDialogClose={handleDialogClose}
          handleConfirmed={handleDelete}
          message={` Are you sure you want to delete this sheet?`}
          title={`Confirm Sheet Deletion`}
        />
      </Card>
    </>
  );
};

export default SheetCard;
