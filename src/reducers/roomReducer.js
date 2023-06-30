import { 
    GET_ROOM,
    GET_ROOMS,
    GET_ROOM_TYPES,
    PRODUCT_SELECTED_ROOM,
    SET_SELECTED_ROOM
} from '../actions/types';

const intialState = {
    room: {}, 
    rooms: [],
    roomTypes: [],
    selectedRoom: {},
    ProductSelectedRoom:[]
}

const roomReducer = (state = intialState, action) => {
    switch (action.type) {
        case GET_ROOM: {
            return {
                ...state, 
                room: action.payload
            }
        }
        case GET_ROOMS: {
            return {
                ...state, 
                rooms: action.payload
            }
        }
        case GET_ROOM_TYPES: {
            return {
                ...state, 
                roomTypes: action.payload
            }
        }
        case SET_SELECTED_ROOM: {
            return {
                ...state, 
                selectedRoom: action.payload
            }
        }
        case PRODUCT_SELECTED_ROOM: {
            return {
                ...state, 
                ProductSelectedRoom: action.payload
            }
        }
        default: 
            return state;
    }
};

export default roomReducer;