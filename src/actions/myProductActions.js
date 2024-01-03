import api from "../api";
import {
  CREATE_MY_PRODUCT,
  GET_MY_PRODUCTS,
  SET_SELECTED_MY_PRODUCT,
  LOGOUT,
  GET_MY_PRODUCTS_BY_PROJECT,
  SET_SELECTED_PROJECT,
} from "./types";

export const getMyProducts = () => (dispatch) => {
  const URL = "/builder-product";

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch({ type: GET_MY_PRODUCTS, payload: response.data });

        return response.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });

      console.log("Getting MyProducts", error);
    });
};

export const editMyProduct = (product) => (dispatch) => {
  const URL = "/builder-product";

  return api({
    method: "PUT",
    url: URL,
    data: product,
  })
    .then((response) => {
      if (response?.status === 200) {
        return response.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });

      console.log("Getting MyProducts", error);
    });
};

export const createMyProduct = (product) => (dispatch) => {
  const URL = "/builder-product";

  return api({
    method: "POST",
    url: URL,
    data: product,
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

export const deleteMyProduct = (ID) => (dispatch) => {
  const URL = `/builder-product/${ID}`;

  return api({
    method: "DELETE",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        return response.data;
      }
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const setSelectedMyProduct = (product) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: SET_SELECTED_MY_PRODUCT, payload: product });

    resolve();
  });
};

/**
 *
 * @param {*} product
 * @returns
 */
export const handleAddMyProductToProject = (product) => (dispatch) => {
  const URL = `/builder-product/projectproduct`;

  return api({
    method: "POST",
    url: URL,
    data: product,
  })
    .then((response) => {
      if (response?.status === 200) {
        // dispatch({ type: SET_SELECTED_PROJECT, payload: response.data });

        return response?.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const getMyProductsForProject = (ID) => (dispatch) => {
  const URL = `/builder-product/projectproduct/${ID}`;

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch({ type: GET_MY_PRODUCTS_BY_PROJECT, payload: response.data });
        return response.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });

      console.log("Getting MyProducts", error);
    });
};

export const updateMyProductsForProject = (params) => (dispatch) => {
  const URL = `/builder-product/projectproduct`;

  return api({
    method: "PUT",
    url: URL,
    data: params,
  })
    .then((response) => {
      if (response?.status === 200) {
        return response.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });

      console.log("Getting MyProducts", error);
    });
};

export const updateBuilderRoomProduct =
  (projectId, productIds, value, field) => (dispatch) => {
    const URL = `/builder-product/Product/`;

    const data = {
      ProjectID: projectId,
      ProductIDs: [productIds],
      PatchModel: [
        {
          op: "replace",
          path: `/${field}`,
          value: value,
        },
      ],
    };

    return api({
      method: "PATCH",
      url: URL,
      data: data,
    })
      .then((response) => {
        if (response?.status === 200) {
          dispatch({ type: SET_SELECTED_PROJECT, payload: response.data });
          return response.data;
        }
      })
      .catch((error) => {
        if (error?.response?.status === 401) dispatch({ type: LOGOUT });
      });
  };

export const deleteMyProductsForProject = (ID) => (dispatch) => {
  const URL = `/builder-product/projectproduct/${ID}`;

  return api({
    method: "DELETE",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        return response.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });

      console.log("Getting MyProducts", error);
    });
};
