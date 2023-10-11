import * as yup from "yup";

export const BankFormValidationSchema = yup.object().shape({
  amount: yup
    .number()
    .positive("Amount must be a positive number")
    .typeError("Amount must be a number")
    .required("Amount in Birr is required"),
  // reason: yup.string().required("Reason is required"),
  // name: yup.string().required("Name is required"),
  // placement: yup.string().required("Placement is required"),
  bankName: yup.string().required("Please select a Bank"),
  transactionType: yup.string().required("Please select a Transaction Type"),
});
