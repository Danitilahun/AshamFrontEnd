import axios from "axios";
import { API_BASE_URL } from "../utils/config";

// Arrow function to create a branch using Axios

const createCredit = async (user, CreditData, type) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.admin === true || idTokenResult.claims.finance) {
        const idToken = await user.getIdToken();
        const response = await axios.post(
          `${API_BASE_URL}api/credit/${type}`,
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
    throw error;
  }
};

export default createCredit;
