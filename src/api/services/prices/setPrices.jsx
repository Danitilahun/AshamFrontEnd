import axios from "axios";
import { API_BASE_URL } from "../../utils/config";

const editPrices = async (user, editFormValues, endpoint) => {
  console.log(editFormValues, "from the function");
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.superAdmin === true) {
      const idToken = await user.getIdToken();
      const res = await axios.put(
        `${API_BASE_URL}price/${endpoint}`,
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
      throw new Error(`You are not authorized to update price.`);
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

export default editPrices;
