import axios from "axios";

const { API_BASE_URL } = require("../../utils/config");

const deleteSheet = async (user, sheetId) => {
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
      const res = await axios.delete(`${API_BASE_URL}sheet/${sheetId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      // Handle successful deletion

      return res;
    } else {
      throw new Error("User is not authorized to delete this sheet.");
    }
  } catch (error) {
    if (error.isAxiosError) {
      throw new Error(error.message);
    } else {
      throw error;
    }
  }
};

export default deleteSheet;
