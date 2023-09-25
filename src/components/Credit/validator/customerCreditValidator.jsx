import * as yup from "yup";

export const CustomerCreditFormValidationSchema = yup.object().shape({
  name: yup.string().required("Customer Name is required"),
  address: yup.string().required("Address is required"),
  phone: yup.string().required("Phone is required"),
  reason: yup.string().required("Reason is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount in Birr is required"),
});
