import { 
    GET_BUILDER_SELECTED_ROOM_TYPE,
    GET_BUILDER_SELECTED_ROOM_GROUP,
    GET_BUILDER_SELECTED_ROOM_CATEGORY
} from '../actions/types';

const intialState = {
    builderSelectedRoomType: {}, 
    builderSelectedRoomGroup: {},
    builderSelectedRoomCategory: {},
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
        default: 
            return state;
    }
};

export default builderRoomsReducer;