import axios from "axios";
import { API_BASE_URL } from "../utils/config";

// Arrow function to create a branch using Axios

const createExpense = async (user, CreditData) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.finance === true) {
        const idToken = await user.getIdToken();
        const response = await axios.post(
          `${API_BASE_URL}api/expense`,
          CreditData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        // Handle successful submission

        return response;
      } else {
        console.log("User is not authorized to create a branch.");
        throw {
          response: {
            data: {
              message: "User is not authorized",
              type: "error",
            },
          },
        };
        // Handle case when the user is not a super admin
      }
    }
  } catch (error) {
    // console.log(`Error occurred while creating ${type}.`, error);
    throw error;
  }
};

export default createExpense;
