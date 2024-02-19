import { GET_SUBDIVISIONS, ADD_SUBDIVISION } from "../actions/types";

const intialState = {
  subdivisions: [],
};

const subdivisionReducer = (state = intialState, action) => {
  switch (action.type) {
    case GET_SUBDIVISIONS: {
      return {
        ...state,
        subdivisions: action.payload,
      };
    }
    case ADD_SUBDIVISION: {
      return {
        ...state,
        subdivisions: action.payload,
      };
    }
    default:
      return state;
  }
};

export default subdivisionReducer;
