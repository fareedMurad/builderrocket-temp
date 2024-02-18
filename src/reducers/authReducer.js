import { LOGIN, SET_USER, SET_CUSTOMER_PROJECT } from "../actions/types";

const intialState = {
  token: null,
  isSignedIn: false,
};

const authReducer = (state = intialState, action) => {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        // action.payload
      };
    }
    case SET_USER: {
      return {
        ...state,
        token: action.payload,
        isSignedIn: true,
      };
    }
    case SET_CUSTOMER_PROJECT: {
      return {
        ...state,
        customerproject: action.payload,
      };
    }
    default:
      return state;
  }
};

export default authReducer;
