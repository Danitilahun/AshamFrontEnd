import * as yup from "yup";

export const FormValidationSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount in Birr is required"),
  reason: yup.string().required("Reason is required"),
  placement: yup.string().required("Placement is required"),
  employeeId: yup.string().required("Please select a Employee"),
});
