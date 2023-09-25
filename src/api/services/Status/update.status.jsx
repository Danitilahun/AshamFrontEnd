import axios from "axios";
import { API_BASE_URL } from "../../utils/config";

const updateStatus = async (id, user, branchData) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (
      idTokenResult.claims.superAdmin === true ||
      idTokenResult.claims.admin === true
    ) {
      const idToken = await user.getIdToken();
      const res = await axios.put(`${API_BASE_URL}status/${id}`, branchData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });
      return res;
    } else {
      throw new Error("User is not authorized to create a branch.");
    }
  } catch (error) {
    console.log("Error occurred while creating branch.", error);
    if (error.isAxiosError) {
      throw new Error(error.message);
    } else {
      throw error;
    }
  }
};

export default updateStatus;
