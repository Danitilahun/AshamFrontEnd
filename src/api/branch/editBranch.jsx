import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const updateBranch = async (user, id, BranchData) => {
  try {
    if (!user) {
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.superAdmin === true) {
      const idToken = await user.getIdToken();
      const res = await axios.put(
        `${API_BASE_URL}api/branch/${id}`,
        BranchData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      return res;
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
  } catch (error) {
    throw error;
  }
};

export default updateBranch;
