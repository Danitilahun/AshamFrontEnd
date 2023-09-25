import axios from "axios";

const { API_BASE_URL } = require("../../utils/config");

const deleteOrder = async (user, userId, type) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (
      idTokenResult.claims.superAdmin === true ||
      idTokenResult.claims.admin === true ||
      idTokenResult.claims.callCenter === true
    ) {
      const idToken = await user.getIdToken();
      const res = await axios.delete(`${API_BASE_URL}order/${type}/${userId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      // Handle successful deletion

      return res;
    } else {
      throw new Error("User is not authorized to delete a branch.");
    }
  } catch (error) {
    console.log("Error occurred while deleting branch.", error);
    if (error.isAxiosError) {
      throw new Error(error.message);
    } else {
      throw error;
    }
  }
};

export default deleteOrder;
