import * as yup from "yup";

export const ExpenseFormValidationSchema = yup.object().shape({
  name: yup.string().required("Customer Name is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount in Birr is required"),
});
