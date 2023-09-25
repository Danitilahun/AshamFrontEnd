import axios from "axios";

const { API_BASE_URL } = require("../../utils/config");

const deleteStatus = async (user, userId, active) => {
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
      const res = await axios.delete(
        `${API_BASE_URL}status/${userId}/${active}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
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

export default deleteStatus;
