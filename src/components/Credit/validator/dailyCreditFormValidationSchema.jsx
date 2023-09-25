import * as yup from "yup";

export const DailyCreditFormValidationSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount in Birr is required"),
  reason: yup.string().required("Reason is required"),
  deliveryguyId: yup.string().required("Please select a Delivery Guy"),
});
