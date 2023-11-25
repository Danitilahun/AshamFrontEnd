import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const createBank = async (user, BankData) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (
        idTokenResult.claims.admin === true ||
        idTokenResult.claims.finance === true
      ) {
        const idToken = await user.getIdToken();
        const response = await axios.post(`${API_BASE_URL}api/bank`, BankData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });

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

export default createBank;
