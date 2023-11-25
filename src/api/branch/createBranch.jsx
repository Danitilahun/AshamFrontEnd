import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const createBranch = async (user, BranchData) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.superAdmin === true) {
        const idToken = await user.getIdToken();
        const response = await axios.post(
          `${API_BASE_URL}api/branch/`,
          BranchData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

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

export default createBranch;
