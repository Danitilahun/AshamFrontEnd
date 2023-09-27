import axios from "axios";

import { API_BASE_URL } from "../utils/config";

const Delete = async (user, Id, type) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (
      idTokenResult.claims.admin === true ||
      idTokenResult.claims.callCenter === true
    ) {
      const idToken = await user.getIdToken();
      const res = await axios.delete(`${API_BASE_URL}api/order/${type}/${Id}`, {
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

export default Delete;
