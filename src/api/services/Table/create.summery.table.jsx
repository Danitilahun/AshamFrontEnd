import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import getNumberOfDocumentsInCollection from "../../utils/getNumberOfDocument";
import getInternationalDate from "../../../utils/getDate";

const createSummeryTable = async (user, branchId, sheetId) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (
        idTokenResult.claims.superAdmin === true ||
        idTokenResult.claims.admin === true
      ) {
        const idToken = await user.getIdToken();

        // const date = getInternationalDate();
        const TableData = {
          branchId: branchId,
          sheetId: sheetId,
        };
        const response = await axios.post(
          `${API_BASE_URL}table/summery`,
          TableData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        // Handle successful submission
        return response;
      } else {
        throw new Error("User is not authorized to create a branch.");
        // Handle case when the user is not a super admin
      }
    }
  } catch (error) {
    if (error.isAxiosError) {
      throw new Error(error.response.data.error);
    } else {
      throw error;
    }
  }
};

export default createSummeryTable;
