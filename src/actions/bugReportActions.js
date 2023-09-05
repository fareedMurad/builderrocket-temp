import api from "../api";
import { LOGOUT } from "./types";
export const sendBugs = (support) => (dispatch) => {
  const URL = "/support";

  return api({
    method: "POST",
    url: URL,
    data: support,
  })
    .then((response) => {
      if (response?.status === 200) {

        return response.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });
    });
};
