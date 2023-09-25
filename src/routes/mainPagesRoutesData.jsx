import React from "react";
import { Route } from "react-router-dom";
import RequireAuth from "../components/VersatileComponents/RequireAuth";
import Branch from "../pages/Collection/Branch";
import Admin from "../pages/Collection/Admin";
import CallCenter from "../pages/Collection/CallCenter";
import Finance from "../pages/Collection/Finance";
import Customer from "../pages/Collection/Customer";

const mainRoutesData = [
  { path: "/branch", component: Branch },
  { path: "/admin", component: Admin },
  { path: "/callcenter", component: CallCenter },
  { path: "/finance", component: Finance },
  { path: "/customer", component: Customer },
];

const mainPagesRoutesData = () => {
  return (
    <>
      {mainRoutesData.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            <RequireAuth>
              <route.component />
            </RequireAuth>
          }
        />
      ))}
    </>
  );
};

export default mainPagesRoutesData;
