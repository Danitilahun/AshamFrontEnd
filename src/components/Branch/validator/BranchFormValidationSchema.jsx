import * as yup from "yup";
export const BranchFormValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  phone: yup.string().required("Phone is required"),

  account: yup.string().required("Account is required"),

  budget: yup
    .number()
    .positive("Amount must be a positive number")
    .typeError("Budget must be a number")
    .required("Budget in Birr is required"),
  taxPersentage: yup
    .number()
    .positive("Amount must be a positive number")
    .typeError("Tax percentage must be a number")
    .min(0, "Tax percentage must be non-negative")
    .max(100, "Tax percentage cannot exceed 100")
    .required("Tax percentage is required"),

  ethioTelBill: yup
    .number()
    .positive("Amount must be a positive number")
    .typeError("Ethio Tel Bill must be a number")
    .required("Ethio Tel Bill in Birr is required"),

  ethioTelAccount: yup.string().required("Ethio Tele Account is required"),
  ethioTelOwnerName: yup.string().required("Ethio Tele Owner Name is required"),

  wifi: yup
    .number()
    .positive("Amount must be a positive number")
    .typeError("Wifi must be a number")
    .required("Wifi in Birr is required"),

  wifiAccount: yup.string().required("Wifi Account is required"),
  wifiOwnerName: yup.string().required("Wifi Owner Name is required"),

  houseRent: yup
    .number()
    .positive("Amount must be a positive number")
    .typeError("House Rent must be a number")
    .required("House Rent in Birr is required"),

  houseRentAccount: yup.string().required("House renter account is required"),
  houseRentOwnerName: yup.string().required("house Owner Name  is required"),

  ExpenseOneName: yup.string().test({
    name: "expenseOneNameOrAmount",
    test: function (value) {
      const expenseOneAmount = this.parent.ExpenseOneAmount;

      if (
        (!value || !value.trim()) &&
        (!expenseOneAmount || expenseOneAmount === 0)
      ) {
        return true; // Validation passes when both are empty or zero
      }

      if (!value || !value.trim()) {
        return this.createError({
          path: "ExpenseOneName",
          message:
            "Expense One Name is required when Expense One Amount has a value",
        });
      }

      return true;
    },
  }),

  ExpenseOneAmount: yup.number().test({
    name: "expenseOneNameOrAmount",
    test: function (value) {
      const expenseOneName = this.parent.ExpenseOneName;

      if (
        (!value || value === 0) &&
        (!expenseOneName || !expenseOneName.trim())
      ) {
        return true; // Validation passes when both are empty or zero
      }

      if (!value || value === 0) {
        return this.createError({
          path: "ExpenseOneAmount",
          message:
            "Expense One Amount is required when Expense One Name has a value",
        });
      }

      if (value < 0) {
        return this.createError({
          path: "ExpenseOneAmount",
          message: "Expense One Amount must be positive",
        });
      }

      return true;
    },
  }),

  ExpenseTwoName: yup.string().test({
    name: "expenseTwoNameOrAmount",
    test: function (value) {
      const expenseTwoAmount = this.parent.ExpenseTwoAmount;

      if (
        (!value || !value.trim()) &&
        (!expenseTwoAmount || expenseTwoAmount === 0)
      ) {
        return true; // Validation passes when both are empty or zero
      }

      if (!value || !value.trim()) {
        return this.createError({
          path: "ExpenseTwoName",
          message:
            "Expense Two Name is required when Expense Two Amount has a value",
        });
      }

      return true;
    },
  }),

  ExpenseTwoAmount: yup.number().test({
    name: "expenseTwoNameOrAmount",
    test: function (value) {
      const expenseTwoName = this.parent.ExpenseTwoName;

      if (
        (!value || value === 0) &&
        (!expenseTwoName || !expenseTwoName.trim())
      ) {
        return true; // Validation passes when both are empty or zero
      }

      if (!value || value === 0) {
        return this.createError({
          path: "ExpenseTwoAmount",
          message:
            "Expense Two Amount is required when Expense Two Name has a value",
        });
      }

      if (value < 0) {
        return this.createError({
          path: "ExpenseTwoAmount",
          message: "Expense Two Amount must be positive",
        });
      }

      return true;
    },
  }),

  ExpenseThreeName: yup.string().test({
    name: "expenseThreeNameOrAmount",
    test: function (value) {
      const expenseThreeAmount = this.parent.ExpenseThreeAmount;

      if (
        (!value || !value.trim()) &&
        (!expenseThreeAmount || expenseThreeAmount === 0)
      ) {
        return true; // Validation passes when both are empty or zero
      }

      if (!value || !value.trim()) {
        return this.createError({
          path: "ExpenseThreeName",
          message:
            "Expense Three Name is required when Expense Three Amount has a value",
        });
      }

      return true;
    },
  }),

  ExpenseThreeAmount: yup.number().test({
    name: "expenseThreeNameOrAmount",
    test: function (value) {
      const expenseThreeName = this.parent.ExpenseThreeName;

      if (
        (!value || value === 0) &&
        (!expenseThreeName || !expenseThreeName.trim())
      ) {
        return true; // Validation passes when both are empty or zero
      }

      if (!value || value === 0) {
        return this.createError({
          path: "ExpenseThreeAmount",
          message:
            "Expense Three Amount is required when Expense Three Name has a value",
        });
      }

      if (value < 0) {
        return this.createError({
          path: "ExpenseThreeAmount",
          message: "Expense Three Amount must be positive",
        });
      }

      return true;
    },
  }),
});
