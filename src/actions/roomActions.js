import api from '../api';
import { 
    // GET_ROOM, 
    GET_ROOMS,
    GET_ROOM_TYPES,
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
        if (error.response.status === 401) 
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
        if (error.response.status === 401) 
            dispatch({ type: LOGOUT });

        console.log('Getting Rooms', error);
    })

}