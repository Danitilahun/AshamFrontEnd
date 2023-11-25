import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const updateCredit = async (user, id, creditData, type) => {
  try {
    if (!user) {
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.admin === true || idTokenResult.claims.finance) {
      const idToken = await user.getIdToken();
      const res = await axios.put(
        `${API_BASE_URL}api/credit/${type}/${id}`,
        creditData,
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

export default updateCredit;
