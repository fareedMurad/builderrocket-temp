import api from '../api';
import { 
    GET_ROOMS,
    GET_ROOM_TYPES,
    SET_SELECTED_ROOM,
    LOGOUT
} from './types';

export const getRooms = () => dispatch => {
    const URL = '/Room';

    return api({
        method: 'GET',
        url: URL
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_ROOMS, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        if (error?.response?.status === 401) 
            dispatch({ type: LOGOUT });

        console.log('Getting Rooms', error);
    })

}


export const getRoomTypes = () => dispatch => {
    const URL = '/RoomType';

    return api({
        method: 'GET',
        url: URL
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_ROOM_TYPES, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        if (error?.response?.status === 401) 
            dispatch({ type: LOGOUT });

        console.log('Getting Rooms', error);
    })
}

export const setSelectedRoom = (room) => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: SET_SELECTED_ROOM, payload: room });

            resolve(room);
        } catch (error) {
            reject(error);
        }
    });
} 