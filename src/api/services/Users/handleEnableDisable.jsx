import axios from "axios";
import { API_BASE_URL } from "../../utils/config";

const enableDisable = async (endpoint, user, userId, editFormValues) => {
  try {
    if (!user) {
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (
      idTokenResult.claims.superAdmin === true ||
      idTokenResult.claims.admin === true
    ) {
      const idToken = await user.getIdToken();
      const res = await axios.put(
        `${API_BASE_URL}${endpoint}/disable/${userId}`,
        editFormValues,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      // Handle successful update

      return res;
    } else {
      throw new Error(`User is not authorized to create a ${endpoint}.`);
    }
  } catch (error) {
    if (error.isAxiosError) {
      throw new Error(error.message);
    } else {
      throw error;
    }
  }
};

export default enableDisable;
