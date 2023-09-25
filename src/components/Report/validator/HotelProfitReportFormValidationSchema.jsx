import * as yup from "yup";

export const HotelProfitReportFormValidationSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount in Birr is required"),
  deliveryguyId: yup.string().required("Please select a Delivery Guy"),
});
