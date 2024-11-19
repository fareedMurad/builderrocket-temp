import { GET_DOCUMENT_TYPES } from "../actions/types";

const intialState = {
  documentTypes: [],
};

const documentReducer = (state = intialState, action) => {
  switch (action.type) {
    case GET_DOCUMENT_TYPES: {
      return {
        ...state,
        documentTypes: action.payload,
      };
    }
    default:
      return state;
  }
};

export default documentReducer;
