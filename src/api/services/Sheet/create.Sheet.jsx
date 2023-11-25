import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import getNumberOfDocumentsInCollection from "../../utils/getNumberOfDocument";
import getInternationalDate from "../../../utils/getDate";

const createSheet = async (user, branchId, active) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (
        idTokenResult.claims.superAdmin === true ||
        idTokenResult.claims.admin === true
      ) {
        const idToken = await user.getIdToken();
        const count = await getNumberOfDocumentsInCollection(
          "sheets",
          "branchId",
          branchId
        );

        const date = getInternationalDate();
        const sheetData = {
          branchId: branchId,
          sheetNumber: count + 1,
          date: new Date(),
          name: "Sheet " + date,
          previousActive: active,
          realDate: new Date(),
          Tables: [],
          tableDate: [],
        };
        const response = await axios.post(`${API_BASE_URL}sheet`, sheetData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });
        // Handle successful submission
        return response;
      } else {
        throw new Error("User is not authorized to create a branch.");
        // Handle case when the user is not a super admin
      }
    }
  } catch (error) {
    if (error.isAxiosError) {
      throw new Error(error.message);
    } else {
      throw error;
    }
  }
};

export default createSheet;
