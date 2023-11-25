import axios from "axios";

import { API_BASE_URL } from "../utils/config";

const deleteIncentive = async (user, id, type) => {
  try {
    if (!user) {
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.admin === true) {
      const idToken = await user.getIdToken();
      const res = await axios.delete(
        `${API_BASE_URL}api/incentive/${type}/${id}`,
        {
          headers: {
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
    if (error.isAxiosError) {
      throw new Error(error.message);
    } else {
      throw error;
    }
  }
};

export default deleteIncentive;
