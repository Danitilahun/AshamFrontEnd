import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const updateProfileImage = async (user, userId, formData) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.superAdmin === true) {
      const idToken = await user.getIdToken();
      const res = await axios.put(
        `${API_BASE_URL}api/user/common/profileImageChange/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      return res;
    } else {
      throw new Error(`User is not authorized to create a.`);
    }
  } catch (error) {
    console.log("Error occurred while creating branch.", error);
    throw error;
  }
};

export default updateProfileImage;
