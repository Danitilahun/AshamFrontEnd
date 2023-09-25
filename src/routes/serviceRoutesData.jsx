import React from "react";
import { Route } from "react-router-dom";
import RequireAuth from "../components/VersatileComponents/RequireAuth";
import Asbeza from "../pages/services/Asbeza";
import Wifi from "../pages/services/Wifi";
import Water from "../pages/services/Water";
import Card from "../pages/services/Card";

const serviceRoutesData = [
  { path: "/service/asbeza/:id", component: Asbeza },
  { path: "/service/wifi/:id", component: Wifi },
  { path: "/service/water/:id", component: Water },
  { path: "/service/card/:id", component: Card },
];

const ServiceRoutes = () => {
  return (
    <>
      {serviceRoutesData.map((route, index) => (
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

export default ServiceRoutes;
