import * as yup from "yup";

export const FormValidationSchema = yup.object().shape({
  amount: yup
    .number()
    .positive("Amount must be a positive number")
    .typeError("Amount must be a number")
    .required("Amount in Birr is required"),
  reason: yup.string().required("Reason is required"),
});
