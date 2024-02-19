import {
  SET_VENDOR_SELECTED_PROJECT_TAB,
  LOGIN,
  SET_VENDOR,
  SET_VENDOR_PRODUCTS,
} from "../actions/types";

const intialState = {
  token: null,
  isSignedIn: false,
  selectedProjectTab: "products",
};

const vendorReducer = (state = intialState, action) => {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        // action.payload
      };
    }
    case SET_VENDOR: {
      return {
        ...state,
        token: action.payload,
        isSignedIn: true,
      };
    }
    case SET_VENDOR_PRODUCTS: {
      return {
        ...state,
        products: action.payload,
      };
    }
    case SET_VENDOR_SELECTED_PROJECT_TAB: {
      return {
        ...state,
        selectedProjectTab: action.payload,
      };
    }

    default:
      return state;
  }
};

export default vendorReducer;
