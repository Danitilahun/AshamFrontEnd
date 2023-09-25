import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const enableDisable = async (user, userId, UserForm) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.superAdmin === true) {
      const idToken = await user.getIdToken();
      const res = await axios.put(
        `${API_BASE_URL}api/user/common/disable/${userId}`,
        UserForm,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      return res;
    } else {
      throw new Error(`User is not authorized to create .`);
    }
  } catch (error) {
    throw error;
  }
};

export default enableDisable;
