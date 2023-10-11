import * as yup from "yup";

export const ReportFormValidationSchema = yup.object().shape({
  numberOfCard: yup
    .number()
    .positive("Amount must be a positive number")
    .typeError("Number of card must be a number")
    .required("Number of card is required"),
  deliveryguyId: yup.string().required("Please select a Delivery Guy"),
  amount: yup
    .number()
    .positive("Amount must be a positive number")
    .typeError("Amount must be a number")
    .required("Amount in Birr is required"),
});
