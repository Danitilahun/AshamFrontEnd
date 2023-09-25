import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
const AddBonus = async (user, BonusData) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (
        idTokenResult.claims.superAdmin === true ||
        idTokenResult.claims.admin === true
      ) {
        const idToken = await user.getIdToken();
        const response = await axios.post(
          `${API_BASE_URL}table/holiday`,
          BonusData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        // Handle successful submission
        console.log("Branch created successfully.");
        return response;
      } else {
        console.log("User is not authorized to create a branch.");
        throw new Error("User is not authorized to create a branch.");
        // Handle case when the user is not a super admin
      }
    }
  } catch (error) {
    // console.log("Error occurred while creating branch.", error);
    if (error.isAxiosError) {
      console.log(
        "Error occurred while creating branch.",
        error.response.data.error,
        error.message,
        error.stack
      );
      throw new Error(error.response.data.error);
    } else {
      throw error;
    }
  }
};

export default AddBonus;
