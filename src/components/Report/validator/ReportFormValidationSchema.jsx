import * as yup from "yup";

export const ReportFormValidationSchema = yup.object().shape({
  numberOfCard: yup
    .number()
    .typeError("Number of card must be a number")
    .required("Number of card is required"),
  deliveryguyId: yup.string().required("Please select a Delivery Guy"),
});
