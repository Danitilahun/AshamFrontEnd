import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import getInternationalDate from "../../utils/getDate";

const create = async (user, Data, type) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (
        idTokenResult.claims.admin === true ||
        idTokenResult.claims.callCenter === true
      ) {
        const idToken = await user.getIdToken();
        const date = getInternationalDate();
        Data.createdDate = date;
        const response = await axios.post(
          `${API_BASE_URL}api/order/${type}`,
          Data,
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
        // Handle case when the user is not a super admin
      }
    }
  } catch (error) {
    throw error;
  }
};

export default create;
