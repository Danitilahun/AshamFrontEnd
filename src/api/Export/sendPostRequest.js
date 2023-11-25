import axios from "axios";
import { API_BASE_URL } from "../utils/config";

// Arrow function to create a branch using Axios

const Export = async (user, data) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (
        idTokenResult.claims.admin === true ||
        idTokenResult.claims.superAdmin === true ||
        idTokenResult.claims.finance === true
      ) {
        const idToken = await user.getIdToken();
        const response = await axios.post(
          `${API_BASE_URL}api/export/${data.endpoint}`,
          data,
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
      }
    }
  } catch (error) {
    throw error;
  }
};

export default Export;
