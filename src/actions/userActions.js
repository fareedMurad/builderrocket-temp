import axios from 'axios';
import {
    GET_USER_PROFILE,
    LOGOUT
} from './types';

const baseURL = process.env.REACT_APP_BUILDER_ROCKET_API;

export const getUserProfile = (token) => dispatch => {
    let URL = `${baseURL}/User`;

    return axios({
        method: 'GET', 
        url: URL, 
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_USER_PROFILE, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        if (error.response.status === 401) 
            dispatch({ type: LOGOUT });

        console.log('Get User Profile', error);
    });
}