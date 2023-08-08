import { 
    GET_BUILDER_SELECTED_ROOM_TYPE,
    GET_BUILDER_SELECTED_ROOM_GROUP,
    GET_BUILDER_SELECTED_ROOM_CATEGORY,
    GET_BUILDER_SELECTED_ROOM_CATEGORY_PRODUCTS
} from '../actions/types';

const intialState = {
    builderSelectedRoomType: {}, 
    builderSelectedRoomGroup: {},
    builderSelectedRoomCategory: {},
    builderSelectedRoomCategoryProducts: []
}

const builderRoomsReducer = (state = intialState, action) => {
    switch (action.type) {
        case GET_BUILDER_SELECTED_ROOM_TYPE: {
            return {
                ...state, 
                builderSelectedRoomType: action.payload
            }
        }
        case GET_BUILDER_SELECTED_ROOM_GROUP: {
            return {
                ...state, 
                builderSelectedRoomGroup: action.payload
            }
        }
        case GET_BUILDER_SELECTED_ROOM_CATEGORY: {
            return {
                ...state, 
                builderSelectedRoomCategory: action.payload
            }
        }
        case GET_BUILDER_SELECTED_ROOM_CATEGORY_PRODUCTS: {
            return {
                ...state, 
                builderSelectedRoomCategoryProducts: action.payload
            }
        }
        default: 
            return state;
    }
};

export default builderRoomsReducer;