import axios from "axios";

import { API_BASE_URL } from "../utils/config";

const deleteBranch = async (user, Id) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.superAdmin === true) {
      const idToken = await user.getIdToken();
      const res = await axios.delete(`${API_BASE_URL}api/branch/${Id}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      // Handle successful deletion

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
    console.log(`Error occurred while creating Branch.`, error);
    throw error;
  }
};

export default deleteBranch;
