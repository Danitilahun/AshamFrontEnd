import * as React from "react";
import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  styled,
  useTheme,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import CallcenterEditForm from "../../editUserForm/callCenter";
import { useAuth } from "../../../../contexts/AuthContext";
import { useSnackbar } from "../../../../contexts/InfoContext";
import deleteUser from "../../../../api/users/delete";
import UserHeader from "./header";
import CustomEllipsisTextField from "../../../CustomComponents/CustomEllipsisTextField";
import EmergencyInformation from "../../common/EmergencyInformation";
import ConfirmationDialog from "../../../VersatileComponents/ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { useBranch } from "../../../../contexts/BranchContext";
import { SpinnerContext } from "../../../../contexts/SpinnerContext";
import { useContext } from "react";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const UserCard = ({ userInfo }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {isSubmitting, setIsSubmitting} = useContext(SpinnerContext);
  const { openSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const handleDeleteIconClick = () => {
    setOpenDialog(true);
  };
  const {
    changeBranch,
    changeBranchName,
    changecallCenterId,
    changecallCenterName,
  } = useBranch();
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleEdit = () => {
    setDialogOpen(true);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCardClick = (event) => {
    event.preventDefault();
    changeBranchName("");
    changeBranch("");
    changecallCenterId(userInfo.id);
    changecallCenterName(userInfo.fullName);
    localStorage.setItem("userData", JSON.stringify({}));
    localStorage.setItem("userData", JSON.stringify(userInfo));
    navigate(`/service/asbeza/${userInfo.id}`);
  };
  return (
    <>
      
      <Card
        sx={{
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
          color: theme.palette.secondary[700],
          marginTop: "1rem",
          // maxWidth: 280,
        }}
      >
        <UserHeader
          userInfo={userInfo}
          anchorEl={anchorEl}
          handleMenuOpen={handleMenuOpen}
          handleMenuClose={handleMenuClose}
          handleEdit={handleEdit}
          handleDeleteIconClick={handleDeleteIconClick}
          handleCardClick={handleCardClick}
        />

        <CardContent>
          <CustomEllipsisTextField label="Phone" value={userInfo.phone} />
          <CustomEllipsisTextField label="Email" value={userInfo.email} />
          <CustomEllipsisTextField
            label="BankAccount"
            value={userInfo.bankAccount}
          />
          <CustomEllipsisTextField
            label="FullAddress"
            value={userInfo.fullAddress}
          />
        </CardContent>
        <CardActions disableSpacing>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <EmergencyInformation expanded={expanded} userInfo={userInfo} />
      </Card>
      {dialogOpen && (
        <CallcenterEditForm
          callcenter={userInfo}
          isEditDialogOpen={dialogOpen}
          closeEditDialog={() => setDialogOpen(false)}
        />
      )}
    </>
  );
};

export default UserCard;
