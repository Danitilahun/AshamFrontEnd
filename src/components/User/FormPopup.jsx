import React, { useContext, useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import getEndpointFromType from "../../utils/getEndpoint";
import handleImagePreview from "../../utils/imagePreview";
import createForm from "../../utils/createForm";
import RegistrationForm from "./RegistrationForm";
import fetchData from "../../api/services/Users/getUser";
import createUser from "../../api/services/Users/createUser";
import { useSnackbar } from "../../contexts/InfoContext";
import { useParams } from "react-router-dom";
import getNumberOfDocumentsInCollection from "../../api/utils/getNumberOfDocument";
import { SpinnerContext } from "../../contexts/SpinnerContext";

const FormPopup = ({ type }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user, forgotPassword } = useAuth();
  const [branches, setBranches] = useState([]);
  const { openSnackbar } = useSnackbar();
  const params = useParams();
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  let currentTable;
  let active;
  let numberofworker;
  let uniqueName;
  const storedData = localStorage.getItem("userData");
  if (storedData) {
    const userData = JSON.parse(storedData);
    if (userData) {
      currentTable =
        userData.activeTable !== undefined ? userData.activeTable : "";
      active = userData.active !== undefined ? userData.active : "";
      numberofworker =
        userData.numberofworker !== undefined ? userData.numberofworker : 0;
      uniqueName = userData.uniqueName !== undefined ? userData.uniqueName : "";
    }
  }

  useEffect(() => {
    const unsubscribe = fetchData("branches", setBranches);
    return () => unsubscribe();
  }, []);

  // const branch = branches.map((item) => item.name);
  const branch = branches
    ?.filter((item) => item.manager === "")
    .map((item) => [item.name, item.id]);

  const handleOpen = () => {
    setImagePreview(null);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    handleImagePreview(e, setImagePreview);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    setIsSubmitting(true);
    event.preventDefault();

    try {
      const formData = createForm(event);
      if (type === "Delivery Guy") {
        formData.append("branch", params.id);
        formData.append("activeTable", currentTable);
        formData.append("active", active);
        formData.append("role", "DeliveryGuy");
        const unique = uniqueName + `D-${numberofworker + 1}`;
        formData.append("uniqueName", unique);
        const count = await getNumberOfDocumentsInCollection(
          "sheets",
          "branchId",
          params.id
        );
        formData.append("sheetNumber", count);
      }

      const endpoint = getEndpointFromType(type);
      if (endpoint === "deliveryguy") {
        if (type === "Delivery Guy") {
          formData.append("type", "deliveryguy");
        } else {
          formData.append("type", "staff");
          formData.append("branch", params.id);
          formData.append("active", active);
          const unique = uniqueName + `S-${numberofworker + 1}`;
          formData.append("uniqueName", unique);
        }
      }
      await createUser(formData, user, endpoint);
      if (type !== "Delivery Guy" && type !== "Staff") {
        forgotPassword(event.target.elements.email.value);
      }

      openSnackbar(`${type} created successful!`, "success");

      handleCloseForm();
      if (type === "Delivery Guy") {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (storedData) {
          storedData.numberofworker = parseInt(storedData.numberofworker) + 1;
        }
        localStorage.setItem("userData", JSON.stringify(storedData));
      }
    } catch (error) {
      openSnackbar(error.message, "error");
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create new {type}
      </Button>
      <RegistrationForm
        usertype={type}
        showForm={showForm}
        handleCloseForm={handleCloseForm}
        handleSubmit={handleSubmit}
        imagePreview={imagePreview}
        handleImageChange={handleImageChange}
        branch={branch}
      />
    </div>
  );
};

export default FormPopup;
