import api from "../api";
import {
  GET_CUSTOMER_DOCUMENTS,
  LOGOUT,
  SET_CUSTOMER,
  SET_CUSTOMER_SELECTED_PROJECT_TAB,
  GET_CUSTOMER_PRODUCTS,
} from "./types";

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
    ID,
    setError,
  }) =>
  (dispatch) => {
    const URL = "/Account/Customer";

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
        CustomerID: ID,
      },
    })
      .then((response) => {
        if (response?.status === 200) {
          return response?.data;
        }
      })
      .catch((error) => {
        setError(error.response.data);
      });
  };

/**
 * Invite customer to selected project
 * @param {*} ID
 */
export const inviteCustomerToProject = (ID) => (dispatch) => {
  const URL = `/Project/SaveCustomerInvite/${ID}`;

  return api({
    method: "POST",
    url: URL,
    data: { CustomerID: ID },
  })
    .then((response) => {
      if (response?.status === 200) {
        return response?.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });
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
      dispatch({ type: SET_CUSTOMER, payload: response.data });
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

export const getCustomerInvites = (ID) => (dispatch) => {
  const URL = `/Account/GetCustomerInvites/${ID}`;

  return api({
    method: "POST",
    url: URL,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response?.status === 200) {
        return response?.data;
      }
    })
    .catch((error) => {});
};

/**
 * Get customer documents
 *
 */
export const getDocuments = () => (dispatch) => {
  const URL = "/customer-portal/ProjectDocuments";

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch({ type: GET_CUSTOMER_DOCUMENTS, payload: response?.data });

        return response?.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

/**
 * Get customer products
 *
 */
export const getCustomerProducts = () => (dispatch) => {
  const URL = "/customer-portal/ProjectProducts";

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch({ type: GET_CUSTOMER_PRODUCTS, payload: response?.data });

        return response?.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

/**
 * Sets selected project tab
 * @param {*} tab
 */
export const setSelectedProjectTab = (tab) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: SET_CUSTOMER_SELECTED_PROJECT_TAB, payload: tab });

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Customer Approval Product
 * @param {String} ID
 *
 */
export const customerApprovalProducts =
  (items, IsCustomProduct) => (dispatch) => {
    const URL = IsCustomProduct
      ? `/customer-portal/Custom/ApproveProjectProducts`
      : `/customer-portal/ApproveProjectProducts`;
    return api({
      method: "POST",
      url: URL,
      data: { Items: items },
    })
      .then((response) => {
        if (response.status === 200) {
          // dispatch({ type: GET_CUSTOMER_PRODUCTS, payload: response.data });
          return response.data;
        }
      })
      .catch((error) => {
        if (error.response?.status === 401) dispatch({ type: LOGOUT });
      });
  };
