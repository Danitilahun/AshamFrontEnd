import * as yup from "yup";

export const CardFeeReportFormValidationSchema = yup.object().shape({
  price: yup
    .number()
    .positive("Amount must be a positive number")
    .typeError("Price must be a number")
    .required("Price in Birr is required"),
  numberOfCard: yup
    .number()
    .positive("Amount must be a positive number")
    .typeError("Number of card must be a number")
    .required("Number of card is required"),
  deliveryguyId: yup.string().required("Please select a Delivery Guy"),
});
