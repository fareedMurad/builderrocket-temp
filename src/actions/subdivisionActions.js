import api from "../api";
import { SET_USER, LOGOUT } from "./types";

import { GET_SUBDIVISIONS, ADD_SUBDIVISION } from "./types";

export const getSubdivisions = () => (dispatch) => {
  const URL = "/Subdivision";

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch({ type: GET_SUBDIVISIONS, payload: response.data });

        return response.data;
      }
    })
    .catch((error) => {});
};

/**
 * Add new subdivision
 * @param {*} subdivision
 */
export const addSubdivision = (subdivision) => (dispatch) => {
  const URL = "/Subdivision";

  return api({
    method: "POST",
    url: URL,
    data: subdivision,
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch({ type: ADD_SUBDIVISION, payload: response?.data });

        return response?.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });
    });
};
