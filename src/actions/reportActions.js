import api from "../api";
import {
  SET_REPORTS_FILTER,
  GET_REPORTS_FILTER,
  SET_ROOMS_FILTER,
  GET_ROOMS_FILTER,
  SET_CUSTOMER_FILTER,
  GET_CUSTOMER_FILTER,
  SET_EMPTY_DATA_FILTER,
  SET_ROUGH_IN_TRIM_OUT_FILTER,
  LOGOUT,
} from "./types";

export const setReportFilter = (filter) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: SET_REPORTS_FILTER, payload: filter });

      resolve(filter);
    } catch (error) {
      reject(error);
    }
  });
};

export const getReportFilter = (filter) => (dispatch) => {
  dispatch({ type: GET_REPORTS_FILTER, payload: filter });
};

export const setRoomFilter = (filter) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: SET_ROOMS_FILTER, payload: filter });

      resolve(filter);
    } catch (error) {
      reject(error);
    }
  });
};

export const getRoomFilter = (filter) => (dispatch) => {
  dispatch({ type: GET_ROOMS_FILTER, payload: filter });
};

export const setCustomerFilter = (filter) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: SET_CUSTOMER_FILTER, payload: filter });

      resolve(filter);
    } catch (error) {
      reject(error);
    }
  });
};

export const getCustomerFilter = (filter) => (dispatch) => {
  dispatch({ type: GET_CUSTOMER_FILTER, payload: filter });
};

export const setShowEmptyDataFilter = (filter) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: SET_EMPTY_DATA_FILTER, payload: filter });

      resolve(filter);
    } catch (error) {
      reject(error);
    }
  });
};

export const setRoughInTrimOutFilter = (filter) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: SET_ROUGH_IN_TRIM_OUT_FILTER, payload: filter });

      resolve(filter);
    } catch (error) {
      reject(error);
    }
  });
};

export const getReportsFilters = () => (dispatch) => {
  const URL = `/report/filter/All`;
  return api({
    method: "GET",
    url: URL,
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

export const deleteReportsFilter = (ID) => (dispatch) => {
  const URL = `/report/filter/${ID}`;
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
    });
};

export const updateReportsFilter = (filter) => (dispatch) => {
  const URL = `/report/filter`;
  return api({
    method: "PUT",
    url: URL,
    data: filter,
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

export const saveReportsFilter = (filter) => (dispatch) => {
  const URL = `/report/filter`;
  return api({
    method: "POST",
    url: URL,
    data: filter,
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
