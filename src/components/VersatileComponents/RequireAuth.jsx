import { Navigate, useLocation } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useBranch } from "../../contexts/BranchContext";
import { useEffect, useState } from "react";

import getRequiredUserData from "../../utils/getBranchInfo";
const routesToCheck = [
  "/deliveryguy/",
  "/transaction",
  "/dailyreport",
  "/cardfee",
  "/bonuspenality",
  "/carddistribute",
  "/wifidistribute",
  "/waterdistribute",
  "/hotelprofit",
  "/segmentCustomer",
  "/money",
  "/budget",
  "/transaction",
  "/credit",
  "/salary",
  "/bonuspenality",
  "/status",
  "/asbeza",
  "/card",
  "/water",
  "/wifi",
];
const routesToCheckForAdmin = [
  "/branch",
  "/callcenter",
  "/callCenter",
  "/finance",
];
const LoadingAnimation = () => {
  const styles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  };

  return (
    <div style={styles}>
      <CircularProgress />
    </div>
  );
};

const RequireAuth = ({ children }) => {
  const { user, validatingUser, currentUser, gettingUser } = useAuth();
  const location = useLocation();
  const [navigationPath, setNavigationPath] = useState(null); // State for navigation
  const { changecallCenterId } = useBranch();
  useEffect(() => {
    if (!user) {
      return; // No need to proceed if user is not authenticated
    }
    if (location.pathname === "/log") {
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.admin !== undefined) {
        }
        const newRoute = `/`;
        // changecallCenterId(user.uid);
        setNavigationPath(newRoute);
      });
    } else if (location.pathname === "/") {
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.admin !== undefined) {
          if (!user.displayName) {
            setNavigationPath("/");
          } else {
            const newRoute = `/deliveryguy/${user.displayName}`;
            setNavigationPath(newRoute);
          }
        } else if (idTokenResult.claims.callCenter !== undefined) {
          const newRoute = `/service/asbeza/${user.uid}`;
          changecallCenterId(user.uid);
          setNavigationPath(newRoute);
        } else if (idTokenResult.claims.finance !== undefined) {
          const newRoute = `mainFinance/branches/${user.uid}`;
          // changecallCenterId(user.uid);
          setNavigationPath(newRoute);
        }
      });
    } else if (
      routesToCheckForAdmin.some((route) => location.pathname.startsWith(route))
    ) {
      const userDate = getRequiredUserData();
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.admin !== undefined) {
          const newRoute = `/deliveryguy/${user.displayName}`;
          setNavigationPath(newRoute);
        } else if (idTokenResult.claims.callCenter !== undefined) {
          const newRoute = `/service/asbeza/${user.uid}`;
          changecallCenterId(user.uid);
          setNavigationPath(newRoute);
        } else if (idTokenResult.claims.finance !== undefined) {
          const newRoute = `/genzeb/branch`;
          // changecallCenterId(user.uid);
          setNavigationPath(newRoute);
        }
      });
    } else if (
      routesToCheck.some((route) => location.pathname.startsWith(route))
    ) {
      // Check if the user has the "admin" or "superAdmin" claim
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.callCenter !== undefined) {
          const newRoute = `/service/asbeza/${user.uid}`;
          changecallCenterId(user.uid);
          setNavigationPath(newRoute);
        } else if (idTokenResult.claims.finance !== undefined) {
          const newRoute = `/genzeb/branch`;
          // changecallCenterId(user.uid);
          setNavigationPath(newRoute);
        }
      });
    } else if (location.pathname.startsWith("/genzeb")) {
      // Check if the user has the "admin" or "superAdmin" claim

      user.getIdTokenResult().then((idTokenResult) => {
        if (
          idTokenResult.claims.admin !== undefined ||
          // idTokenResult.claims.superAdmin !== undefined ||
          idTokenResult.claims.callCenter !== undefined
        ) {
          const newRoute = "/"; // Redirect to a different route if not authorized
          setNavigationPath(newRoute);
        }
      });
    } else if (location.pathname.startsWith("/service")) {
      // Check if the user has the "admin" or "superAdmin" claim

      user.getIdTokenResult().then((idTokenResult) => {
        if (
          idTokenResult.claims.admin !== undefined ||
          idTokenResult.claims.finance !== undefined
        ) {
          const newRoute = "/"; // Redirect to a different route if not authorized
          setNavigationPath(newRoute);
        }
      });
    }
  }, [user, location.pathname]);

  if (validatingUser) {
    return <LoadingAnimation />;
  }
  if (!user && location.pathname === "/login") {
    return children;
  }
  if (!user) {
    //user is not logged
    return <Navigate to="/login" />;
  }

  if (navigationPath) {
    return <Navigate to={navigationPath} />;
  }
  return children;
};

export default RequireAuth;
