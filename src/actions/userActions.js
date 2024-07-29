import api from "../api";
import { GET_USER_PROFILE, LOGOUT } from "./types";

export const getUserProfile = () => (dispatch) => {
  const URL = `/User`;

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch({ type: GET_USER_PROFILE, payload: response.data });

        return response.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const updateUserProfile = (data) => (dispatch) => {
  const URL = `/User`;

  const {
    FirstName,
    LastName,
    UserName,
    Email,
    PhoneNumber,
    Password,
    Company,
    StreetAddress1,
    StreetAddress2,
    City,
    State,
    Zip,
    File,
  } = data;

  const payload = {
    FirstName,
    LastName,
    UserName,
    Email,
    PhoneNumber,
    Password,
    Company,
    StreetAddress1,
    StreetAddress2,
    City,
    State,
    Zip,
    File,
  };

  const formData = new FormData();
  Object.keys(payload).forEach((key) => {
    const obj = payload[key];
    formData.append(key, obj);
  });

  return api({
    method: "PUT",
    url: URL,
    data: formData,
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch({ type: GET_USER_PROFILE, payload: response.data });

        return response.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });
    });
};
