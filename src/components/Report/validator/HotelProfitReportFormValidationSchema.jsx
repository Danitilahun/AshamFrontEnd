import * as yup from "yup";

export const HotelProfitReportFormValidationSchema = yup.object().shape({
  amount: yup
    .number()
    .positive("Amount must be a positive number")
    .typeError("Amount must be a number")
    .required("Amount in Birr is required")
    .min(150, "Amount cannot be less than 150 Birr"),
  deliveryguyId: yup.string().required("Please select a Delivery Guy"),
});
