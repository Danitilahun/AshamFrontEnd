import * as yup from "yup";
export const BranchFormValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  phone: yup.string().required("Phone is required"),
  ethioTelBill: yup
    .number()
    .typeError("Ethio Tel Bill must be a number")
    .required("Ethio Tel Bill in Birr is required"),
  houseKeeper: yup
    .number()
    .typeError("House Keeper must be a number")
    .required("House Keeper in Birr is required"),
  cleanerSalary: yup
    .number()
    .typeError("Cleaner Salary must be a number")
    .required("Cleaner Salary in Birr is required"),
  wifi: yup
    .number()
    .typeError("Wifi must be a number")
    .required("Wifi in Birr is required"),
  houseRent: yup
    .number()
    .typeError("House Rent must be a number")
    .required("House Rent in Birr is required"),
  account: yup
    .number()
    .typeError("Account must be a number")
    .required("Account in Birr is required"),
  budget: yup
    .number()
    .typeError("Budget must be a number")
    .required("Budget in Birr is required"),
  taxPersentage: yup
    .number()
    .typeError("Tax percentage must be a number")
    .min(0, "Tax percentage must be non-negative")
    .max(100, "Tax percentage cannot exceed 100")
    .required("Tax percentage is required"),

  ExpenseOneName: yup
    .string()
    .typeError(
      "Expense One Name is required when Expense One Amount is greater than 0"
    ),
  ExpenseOneAmount: yup
    .number()
    .typeError("Expense One Amount must be a number")
    .min(0, "Expense One Amount must be non-negative"),

  ExpenseTwoName: yup
    .string()
    .typeError(
      "Expense Two Name is required when Expense Two Amount is greater than 0"
    ),

  ExpenseTwoAmount: yup
    .number()
    .typeError("Expense Two Amount must be a number")
    .min(0, "Expense Two Amount must be non-negative"),
  ExpenseThreeName: yup
    .string()
    .typeError(
      "Expense Three Name is required when Expense Three Amount is greater than 0"
    ),

  ExpenseThreeAmount: yup
    .number()
    .typeError("Expense Three Amount must be a number")
    .min(0, "Expense Three Amount must be non-negative"),
});
