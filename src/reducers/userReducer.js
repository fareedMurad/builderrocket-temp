import { GET_USER_PROFILE } from "../actions/types";

const intialState = {
  user: {},
};

const userReducer = (state = intialState, action) => {
  switch (action.type) {
    case GET_USER_PROFILE: {
      return {
        ...state,
        user: action.payload,
      };
    }
    default:
      return state;
  }
};

export default userReducer;
