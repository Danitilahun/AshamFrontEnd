import axios from "axios";

import { API_BASE_URL } from "../utils/config";

const deleteCredit = async (user, Id, type) => {
  try {
    if (!user) {
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.admin === true || idTokenResult.claims.finance) {
      const idToken = await user.getIdToken();
      const res = await axios.delete(
        `${API_BASE_URL}api/credit/${type}/${Id}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
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

export default deleteCredit;
