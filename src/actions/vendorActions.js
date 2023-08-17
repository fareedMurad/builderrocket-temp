import api from "../api";
import { GET_CUSTOMER_DOCUMENTS, LOGOUT, SET_VENDOR, SET_VENDOR_SELECTED_PROJECT_TAB, GET_CUSTOMER_PRODUCTS, SET_VENDOR_PRODUCTS } from "./types";

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
    setError
  }) =>
  (dispatch) => {
    const URL = "/Account/Vendor";

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
        password: password
      },
    })
      .then((response) => {
        if (response?.status === 200) {
          return response?.data;
        }
      })
      .catch((error) => {
        console.log("Signup", error.response.data);
        setError(error.response.data)
      });
  };


export const loginEmailPassword = (email, password) => (dispatch) => {
  const URL = "/Login";

  return api({
    method: "POST",
    url: URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      Email: email,
      Password: password,
    },
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch({ type: SET_VENDOR, payload: response.data });

        return response?.data;
      }
    })
    .catch((error) => {
      console.log("Login", error);
    });
};


export const getProductsByCategoryAndBrandID = (brandID, categoryID) => dispatch => {
  let URL = `/Vendor/Products/${brandID}/${categoryID}`;

  return api({
      method: 'GET',
      url: URL
  })
      .then((response) => {
          if (response.status === 200) {
              return response.data;
          }
          return [];
      })
      .catch((error) => {
          if (error?.response?.status === 401)
              dispatch({ type: LOGOUT });
      });
}

export const getVendorProducts = () => (dispatch) => {
  const URL = "/Vendor/VendorProduct/All";

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch({type: SET_VENDOR_PRODUCTS, payload: response?.data})
        return response?.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });
    });
};


export const getVendorCategories = () => (dispatch) => {
  const URL = "/Vendor/Category";

  return api({
    method: "GET",
    url: URL,
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

export const getVendorBrands = () => (dispatch) => {
  const URL = "/Vendor/Brands";

  return api({
    method: "GET",
    url: URL,
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

export const addVendorProduct = (BrandID, CategoryID, ProductID) => (dispatch) => {
  const URL = `/Vendor/VendorProduct`;
  return api({
    method: "POST",
    url: URL,
    data: {
      BrandID,
      CategoryID,
      ProductID
    }
  })
    .then((response) => {
      if (response?.status === 200) {
        // dispatch({ type: CREATE_ROOM_TYPES, payload: response.data });

        return response.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });
    });
};


export const deleteVendorProduct = (id) => (dispatch) => {
  const URL = `/Vendor/VendorProduct/${id}`;
  return api({
    method: "DELETE",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        // dispatch({ type: CREATE_ROOM_TYPES, payload: response.data });

        return response.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });
    });
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
export const setSelectedProjectTab = (tab) => dispatch => {
  return new Promise((resolve, reject) => {
      try {
          dispatch({ type: SET_VENDOR_SELECTED_PROJECT_TAB, payload: tab });
          
          resolve();
      } catch (error) {
          reject(error);
      }
  });
}

export const setVendorProducts = (products) => dispatch => {
  return new Promise((resolve, reject) => {
      try {
          dispatch({ type: SET_VENDOR_PRODUCTS, payload: products });
          
          resolve();
      } catch (error) {
          reject(error);
      }
  });
}
