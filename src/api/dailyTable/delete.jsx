import axios from "axios";

import { API_BASE_URL } from "../utils/config";

const deleteTable = async (user, tableId) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.superAdmin === true) {
      const idToken = await user.getIdToken();
      const res = await axios.delete(`${API_BASE_URL}api/table/${tableId}`, {
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
    throw error;
  }
};

export default deleteTable;
