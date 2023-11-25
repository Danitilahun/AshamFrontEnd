import axios from "axios";

import { API_BASE_URL } from "../utils/config";

const deleteSheet = async (user, Id) => {
  try {
    if (!user) {
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.superAdmin === true) {
      const idToken = await user.getIdToken();
      const res = await axios.delete(`${API_BASE_URL}api/sheet/${Id}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
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

export default deleteSheet;
