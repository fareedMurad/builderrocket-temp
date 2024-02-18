import {
  GET_REPORTS_FILTER,
  GET_ROOMS_FILTER,
  SET_REPORTS_FILTER,
  SET_ROOMS_FILTER,
  SET_CUSTOMER_FILTER,
  GET_CUSTOMER_FILTER,
  GET_EMPTY_DATA_FILTER,
  SET_EMPTY_DATA_FILTER,
  SET_ROUGH_IN_TRIM_OUT_FILTER,
  GET_ROUGH_IN_TRIM_OUT_FILTER,
} from "../actions/types";

const initialState = {
  reportFilters: [],
  roomFilters: [],
  isCustomer: false,
  showEmptyData: false,
  roughInTrimOut: null,
};

const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REPORTS_FILTER: {
      return {
        ...state,
        reportFilters: action.payload,
      };
    }
    case GET_REPORTS_FILTER: {
      return {
        ...state,
        reportFilters: action.payload,
      };
    }
    case SET_ROOMS_FILTER: {
      return {
        ...state,
        roomFilters: action.payload,
      };
    }
    case GET_ROOMS_FILTER: {
      return {
        ...state,
        roomFilters: action.payload,
      };
    }
    case SET_CUSTOMER_FILTER: {
      return {
        ...state,
        isCustomer: action.payload,
      };
    }
    case GET_CUSTOMER_FILTER: {
      return {
        ...state,
        isCustomer: action.payload,
      };
    }
    case SET_EMPTY_DATA_FILTER: {
      return {
        ...state,
        showEmptyData: action.payload,
      };
    }
    case GET_EMPTY_DATA_FILTER: {
      return {
        ...state,
        showEmptyData: action.payload,
      };
    }
    case SET_ROUGH_IN_TRIM_OUT_FILTER: {
      return {
        ...state,
        roughInTrimOut: action.payload,
      };
    }
    case GET_ROUGH_IN_TRIM_OUT_FILTER: {
      return {
        ...state,
        roughInTrimOut: action.payload,
      };
    }
    default:
      return state;
  }
};

export default reportReducer;
