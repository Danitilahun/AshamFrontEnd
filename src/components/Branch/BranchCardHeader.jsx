import React from "react";
import {
  CardHeader,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import getHumanReadableDate from "../../utils/humanReadableDate";
import useUserClaims from "../../hooks/useUserClaims";
import { useAuth } from "../../contexts/AuthContext";

const BranchCardHeader = ({
  anchorEl,
  branchData,
  handleMenuOpen,
  handleMenuClose,
  handleCardClick,
  handleEdit,
  handleDeleteIconClick,
  typographyStyles,
}) => {
  const { name, uniqueName, openingDate } = branchData;
  const humanReadableDate = getHumanReadableDate(openingDate);
  const theme = useTheme();
  const { user } = useAuth();
  const userClaims = useUserClaims(user);
  return (
    <CardHeader
      action={
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {userClaims.superAdmin ? (
            <>
              <IconButton
                onClick={handleMenuOpen}
                style={{ color: theme.palette.secondary[100] }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
              >
                <MenuItem onClick={() => handleEdit(branchData)}>Edit</MenuItem>
                <MenuItem onClick={() => handleDeleteIconClick()}>
                  Delete
                </MenuItem>
              </Menu>
            </>
          ) : null}
        </div>
      }
      title={
        <div onClick={handleCardClick}>
          <Typography
            variant="h6"
            fontSize={18}
            sx={{ color: "text.secondary" }}
            style={typographyStyles}
          >
            {`${name} (${uniqueName})`}
          </Typography>
        </div>
      }
      subheader={humanReadableDate}
    />
  );
};

export default BranchCardHeader;
