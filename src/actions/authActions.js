import axios from 'axios';
import { SET_USER, LOGOUT } from './types';

const baseURL = process.env.REACT_APP_BUILDER_ROCKET_API;

export const loginEmailPassword = (email, password) => dispatch => {
    let URL = `${baseURL}/Login`;

    return axios({
        method: 'POST', 
        url: URL,
        headers: { 
            'Content-Type': 'application/json' 
        },
        data: {
            'Email': email, 
            'Password': password
        }
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch(setUser(response?.data));

            return response?.data;
        }
    })
    .catch((error) => {
        console.log('Login', error);
    });
}

export const setUser = (token) => dispatch => {

    if (token) {
        // Add Authorization header to all axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    dispatch({ type: SET_USER, payload: token });
}

export const logout = () => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: LOGOUT });

            delete axios.defaults.headers.common['Authorization'];

            resolve();
        } catch (error) {
            console.log('Logging User Out', error);
            reject(error);
        }
    });
}