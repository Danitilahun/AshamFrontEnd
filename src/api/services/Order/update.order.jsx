import axios from "axios";
import { API_BASE_URL } from "../../utils/config";

// Arrow function to create a branch using Axios
const updateOrder = async (id, user, branchData) => {
  try {
    if (!user) {
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (
      idTokenResult.claims.superAdmin === true ||
      idTokenResult.claims.admin === true ||
      idTokenResult.claims.callCenter === true
    ) {
      const idToken = await user.getIdToken();
      const res = await axios.put(`${API_BASE_URL}order/${id}`, branchData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      // Handle successful update
      return res;
    } else {
      throw new Error("User is not authorized to create a branch.");
    }
  } catch (error) {
    if (error.isAxiosError) {
      throw new Error(error.message);
    } else {
      throw error;
    }
  }
};

export default updateOrder;
