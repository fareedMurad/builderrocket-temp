import {
  GET_BUILDER_ROOM_GROUPS,
  GET_BUILDER_ROOM_TYPES,
  GET_BUILDER_SELECTED_ROOM_TYPE,
  GET_BUILDER_SELECTED_ROOM_GROUP,
  GET_BUILDER_SELECTED_ROOM_CATEGORY,
  GET_BUILDER_SELECTED_ROOM_CATEGORY_PRODUCTS,
  GET_BUILDER_ROOM_GROUP_DETAILS,
} from "../actions/types";

const intialState = {
  builderRoomGroups: [],
  builderRoomTypes: [],
  builderSelectedRoomType: {},
  builderSelectedRoomGroup: {},
  builderSelectedRoomCategory: {},
  builderSelectedRoomCategoryProducts: [],
};

const builderRoomsReducer = (state = intialState, action) => {
  switch (action.type) {
    case GET_BUILDER_ROOM_GROUPS: {
      return {
        ...state,
        builderRoomGroups: action.payload,
      };
    }
    case GET_BUILDER_ROOM_GROUP_DETAILS: {
      return {
        ...state,
        selectedGroupDetails: action.payload,
      };
    }
    case GET_BUILDER_ROOM_TYPES: {
      return {
        ...state,
        builderRoomTypes: action.payload,
      };
    }
    case GET_BUILDER_SELECTED_ROOM_TYPE: {
      return {
        ...state,
        builderSelectedRoomType: action.payload,
      };
    }
    case GET_BUILDER_SELECTED_ROOM_GROUP: {
      return {
        ...state,
        builderSelectedRoomGroup: action.payload,
      };
    }
    case GET_BUILDER_SELECTED_ROOM_CATEGORY: {
      return {
        ...state,
        builderSelectedRoomCategory: action.payload,
      };
    }
    case GET_BUILDER_SELECTED_ROOM_CATEGORY_PRODUCTS: {
      return {
        ...state,
        builderSelectedRoomCategoryProducts: action.payload,
      };
    }
    default:
      return state;
  }
};

export default builderRoomsReducer;
