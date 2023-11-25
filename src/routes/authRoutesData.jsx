import React from "react";
import { Route } from "react-router-dom";
import RequireAuth from "../components/VersatileComponents/RequireAuth";
import LoginForm from "../pages/Auth/LoginForm";
import ForgetPasswordForm from "../pages/Auth/ForgetPasswordForm";
import ResetPasswordForm from "../pages/Auth/ResetPassword";
import SuccessPage from "../pages/success/success";

const authRoutesData = [
  { path: "/login", component: LoginForm, requiresAuth: true },
  { path: "/log", component: () => <div></div>, requiresAuth: true },
  {
    path: "/forget-password",
    component: ForgetPasswordForm,
    requiresAuth: false,
  },
  {
    path: "/reset-password",
    component: ResetPasswordForm,
    requiresAuth: false,
  },
  { path: "/success", component: SuccessPage, requiresAuth: false },
];

const AuthRoutes = () => {
  return (
    <>
      {authRoutesData.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            route.requiresAuth ? (
              <RequireAuth>
                <route.component />
              </RequireAuth>
            ) : (
              <route.component />
            )
          }
        />
      ))}
    </>
  );
};

export default AuthRoutes;
