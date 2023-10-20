import * as yup from "yup";

export const ReportFormValidationSchema = yup.object().shape({
  numberOfCard: yup
    .number()
    .positive("Number of card must be a positive number")
    .typeError("Number of card must be a number")
    .required("Number of card is required")
    .max(150, "Number of cards cannot exceed 150"),
  amount: yup
    .number()
    .positive("Amount must be a positive number")
    .typeError("Amount must be a number")
    .required("Amount in Birr is required")
    .min(150, "Amount cannot be less than 150 Birr"),
  deliveryguyId: yup.string().required("Please select a Delivery Guy"),
});
