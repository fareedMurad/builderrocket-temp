import {
  LOGOUT,
  SET_PRODUCT,
  SET_SELECTED_PROJECT,
  SET_REPLACE_PRODUCT,
  SET_PRODUCTS,
  GET_CATEGORIES,
  SEARCH_PRODUCTS,
  SET_PRODUCT_DETAIL,
  GET_CHILD_CATEGORIES,
  SET_SELECTED_CATEGORY_ID,
  SET_SELECTED_PRODUCT_TAB,
  ROUGHT_IN_TRIM_OUT,
  IS_FAVORITE,
  GET_SUBDIVISIONS,
  GET_BRANDS,
  SET_REPORTS_FILTER,
  SET_PRODUCT_FILTER,
  GET_PRODUCTS,
  SET_PRODUCT_LOADING,
  SET_REPLACE_PRODUCT_ROOMS,
  SET_REPLACE_OLD_PRODUCT,
  SET_REPLACE_OLD_PRODUCT_DETAILS,
} from "../actions/types";
import api from "../api";

export const getBrands = () => (dispatch) => {
  const URL = "/Product/Brands";

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch({ type: GET_BRANDS, payload: response.data });

        return response.data;
      }
      return [];
    })
    .catch((error) => {});
};
export const getCategories = (categoryID) => (dispatch) => {
  let URL = "/product/Category";

  if (categoryID) URL = URL + `/${categoryID}`;

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response.status === 200) {
        if (categoryID) {
          dispatch({
            type: SEARCH_PRODUCTS,
            payload: JSON.parse(response.data),
          });
        } else dispatch({ type: GET_CATEGORIES, payload: response.data });

        return response.data;
      }
      return [];
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const getChildCategories = (categoryID) => (dispatch) => {
  if (!categoryID) return;

  const URL = `/Product/Category/${categoryID}`;

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response.status === 200) {
        dispatch({ type: GET_CHILD_CATEGORIES, payload: response.data });

        return response.data;
      }
      return [];
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const getProducts = (filterObject) => (dispatch) => {
  let URL = "/Product";
  dispatch({ type: SET_PRODUCT_LOADING, payload: true });
  return api({
    method: "POST",
    url: URL,
    data: filterObject,
  })
    .then((response) => {
      if (response.status === 200) {
        dispatch({ type: GET_PRODUCTS, payload: response.pagedResults });
        dispatch({ type: SET_PRODUCT_LOADING, payload: false });
        return response.data;
      }
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });
      dispatch({ type: SET_PRODUCT_LOADING, payload: false });
    });
};

export const searchProducts = (categoryID, searchObject) => (dispatch) => {
  let URL = "/product/Search";

  // if (categoryID) {
  //   URL = `${URL}/${categoryID}`;
  // }

  return api({
    method: "POST",
    url: URL,
    data: {
      PageSize: 50,
      ...searchObject,
      CategoryID: searchObject?.CategoryID ? searchObject?.CategoryID : 0,
      CustomFilters:
        searchObject?.CustomFilters?.Colors ||
        searchObject?.CustomFilters?.Brands
          ? searchObject?.CustomFilters
          : {},
    },
  })
    .then((response) => {
      if (response.status === 200) {
        dispatch({
          type: SEARCH_PRODUCTS,
          payload: response.data,
        });

        return response.data;
      }
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const setSelectedCategoryID = (categoryID) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: SET_SELECTED_CATEGORY_ID, payload: categoryID });

      resolve(categoryID);
    } catch (error) {
      reject(error);
    }
  });
};

export const setProduct = (product) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: SET_PRODUCT, payload: product });

      resolve(product);
    } catch (error) {
      reject(error);
    }
  });
};

export const setReplaceOldProduct = (product) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: SET_REPLACE_OLD_PRODUCT, payload: product });

      resolve(product);
    } catch (error) {
      reject(error);
    }
  });
};

export const getReplaceOldProductDetails = (productID) => (dispatch) => {
  if (!productID) return;

  const URL = `/Product/${productID}/details`;

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response.status === 200) {
        dispatch({
          type: SET_REPLACE_OLD_PRODUCT_DETAILS,
          payload: response.data,
        });

        return response.data;
      }
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const setReplaceProduct = (product) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: SET_REPLACE_PRODUCT, payload: product });

      resolve(product);
    } catch (error) {
      reject(error);
    }
  });
};

export const setProducts = (products) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: SET_PRODUCTS, payload: products });

      resolve(products);
    } catch (error) {}
  });
};

export const setProductDetail = (productDetail) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: SET_PRODUCT_DETAIL, payload: productDetail });

      resolve(productDetail);
    } catch (error) {
      reject(error);
    }
  });
};

export const setCategories = (categories) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: GET_CATEGORIES, payload: categories });

      resolve(categories);
    } catch (error) {
      reject(error);
    }
  });
};

export const getProductDetails = (productID) => (dispatch) => {
  if (!productID) return;

  const URL = `/Product/${productID}/details`;

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response.status === 200) {
        dispatch({ type: SET_PRODUCT_DETAIL, payload: response.data });

        return response.data;
      }
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const getReplaceProduct = (productID, rooms) => (dispatch) => {
  if (!productID) return;

  const URL = `/Product/${productID}/details`;

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response.status === 200) {
        dispatch({ type: SET_REPLACE_PRODUCT, payload: response.data });
        dispatch({ type: SET_REPLACE_PRODUCT_ROOMS, payload: rooms });

        return response.data;
      }
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const setSelectedProductTab = (selectedProductTab) => (dispatch) => {
  if (!selectedProductTab) return;

  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: SET_SELECTED_PRODUCT_TAB, payload: selectedProductTab });

      resolve(selectedProductTab);
    } catch (error) {
      reject(error);
    }
  });
};

export const replaceProductService = (projectId, data) => (dispatch) => {
  let URL = `Project/${projectId}/product/replace`;

  return api({
    method: "POST",
    url: URL,
    data: data,
  })
    .then((response) => {
      if (response.status === 200) {
        dispatch({ type: SET_SELECTED_PROJECT, payload: response.data });
        return response.data;
      }
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const RoughInTrimOutEnum =
  (projectId, productId, value) => (dispatch) => {
    const URL = `/Project/${projectId}/Product/${productId}`;

    const data = [
      {
        op: "replace",
        path: "/RoughInTrimOutEnum",
        value: value,
      },
    ];

    return api({
      method: "PATCH",
      url: URL,
      data: data,
      header: "Content-Type: application/json",
    })
      .then((response) => {
        if (response?.status === 200) {
          dispatch({ type: ROUGHT_IN_TRIM_OUT, payload: response.data });
          return response.data;
        }
      })
      .catch((error) => {});
  };

export const setIsFavorite = (projectId, productId, value) => (dispatch) => {
  const URL = `/Project/${projectId}/Product/${productId}`;

  const data = [
    {
      op: "replace",
      path: "/IsFavorite",
      value: value,
    },
  ];

  return api({
    method: "PATCH",
    url: URL,
    data: data,
    header: "Content-Type: application/json",
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch({ type: IS_FAVORITE, payload: response.data });
        return response.data;
      }
    })
    .catch((error) => {});
};

export const setFilter = (filter) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: SET_PRODUCT_FILTER, payload: filter });

      resolve(filter);
    } catch (error) {
      reject(error);
    }
  });
};

export const addCustomProduct = (params) => (dispatch) => {
  let URL = "/product/AddProduct";
  return api({
    method: "POST",
    url: URL,
    data: params,
  })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const getProductsByCategoryID = (categoryID) => (dispatch) => {
  let URL = "/product/ProductsByCategoryId";

  if (categoryID) URL = URL + `/${categoryID}`;

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response.status === 200) {
        dispatch({ type: SEARCH_PRODUCTS, payload: response.data });
        return response.data;
      }
      return [];
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });
    });
};
