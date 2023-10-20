import * as yup from "yup";

export const CardFeeReportFormValidationSchema = yup.object().shape({
  price: yup
    .number()
    .positive("Amount must be a positive number")
    .typeError("Price must be a number")
    .required("Price in Birr is required")
    .min(150, "Price cannot be less than 150 Birr"),
  numberOfCard: yup
    .number()
    .positive("Number of card must be a positive number")
    .typeError("Number of card must be a number")
    .required("Number of card is required")
    .max(150, "Number of cards cannot exceed 150"),
  deliveryguyId: yup.string().required("Please select a Delivery Guy"),
});
