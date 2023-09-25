import { Navigate, useLocation } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useBranch } from "../../contexts/BranchContext";
import { useEffect, useState } from "react";
import { requestForToken } from "../../services/firebase";
import createNotification from "../../api/services/Notification/registerNotification";
import useDocumentById from "../../hooks/useDocumentById";
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
  const { branchId } = useBranch();
  console.log("from", location.pathname);
  const [navigationPath, setNavigationPath] = useState(null); // State for navigation
  const { changecallCenterId } = useBranch();
  useEffect(() => {
    if (!user) {
      return; // No need to proceed if user is not authenticated
    }
    if (location.pathname === "/log") {
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.admin !== undefined) {
          const tokenPromise = requestForToken();
          tokenPromise.then((token) => {
            if (token !== null) {
              const admin = { [user.displayName]: token };
              createNotification(admin, user)
                .then(() => {
                  console.log("Notification created successfully.");
                })
                .catch((error) => {
                  console.error("Error creating notification:", error);
                });
            } else {
              console.log("No token available.");
            }
          });
        }
        const newRoute = `/`;
        // changecallCenterId(user.uid);
        setNavigationPath(newRoute);
      });
    } else if (location.pathname === "/") {
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.admin !== undefined) {
          const newRoute = `/deliveryguy/${user.displayName}`;
          setNavigationPath(newRoute);
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
      console.log("userDate", userDate);
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
      console.log("object");
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
    console.log("here", user);
    //user is not logged
    return <Navigate to="/login" />;
  }

  // console.log("here", user.displayName);
  if (navigationPath) {
    return <Navigate to={navigationPath} />;
  }
  return children;
};

export default RequireAuth;
