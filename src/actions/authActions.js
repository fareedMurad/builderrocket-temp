import api from "../api";
import { SET_USER, LOGOUT } from "./types";

export const signupEmailPassword =
  ({
    firstName,
    lastName,
    userName,
    email,
    phoneNumber,
    company,
    streetAddress1,
    streetAddress2,
    city,
    state,
    zip,
    password,
  }) =>
  (dispatch) => {
    const URL = "/Account";

    return api({
      method: "POST",
      url: URL,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        FirstName: firstName,
        LastName: lastName,
        UserName: userName,
        Email: email,
        PhoneNumber: phoneNumber,
        Company: company,
        StreetAddress1: streetAddress1,
        StreetAddress2: streetAddress2,
        City: city,
        State: state,
        Zip: zip,
        password: password,
      },
    }).then((response) => {
      if (response?.status === 200) {
        dispatch({ type: SET_USER, payload: response.data });

        return response?.data;
      }
      return response;
    });
  };

export const loginEmailPassword = (email, password) => async (dispatch) => {
  const URL = "/Login";
  try {
    const response = await api({
      method: "POST",
      url: URL,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        Email: email,
        Password: password,
      },
    });
    if (response?.status === 200) {
      dispatch({ type: SET_USER, payload: response.data });
      return response?.data;
    }
    return response;
  } catch (err) {
    if (err.response) {
      return { message: err.response.data };
    }
    return err;
  }
};

export const logout = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: LOGOUT, payload: data });

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
