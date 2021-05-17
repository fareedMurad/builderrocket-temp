import api from '../api';
import {
    GET_USER_PROFILE,
    // LOGOUT
} from './types';

export const getUserProfile = () => dispatch => {
    const URL = `/User`;

    return api({
        method: 'GET', 
        url: URL
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_USER_PROFILE, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        if (error.response.status === 401) 
            // dispatch({ type: LOGOUT });

        console.log('Get User Profile', error);
    });
}