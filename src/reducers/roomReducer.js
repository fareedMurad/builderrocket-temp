import { 
    GET_ROOM,
    GET_ROOMS,
    GET_ROOM_TYPES,
    SET_SELECTED_ROOM
} from '../actions/types';

const intialState = {
    room: {}, 
    rooms: [],
    roomTypes: [],
    selectedRoom: {}
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
        default: 
            return state;
    }
};

export default roomReducer;