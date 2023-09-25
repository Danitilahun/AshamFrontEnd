import * as yup from "yup";

export const EssentialFormValidationSchema = yup.object().shape({
  address: yup.string().required("Address is required"),
  name: yup.string().required("Name is required"),
  phone: yup
    .string()
    .matches(/^\d+$/, "Phone must be a valid number")
    .required("Phone is required"),
  company: yup.string().required("Company is required"),
  sector: yup.string().required("Sector select a Bank"),
});
