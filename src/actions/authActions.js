import api from '../api';
import { SET_USER, LOGOUT } from './types';

export const loginEmailPassword = (email, password) => dispatch => {
    const URL = '/Login';

    return api({
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
            dispatch({ type: SET_USER, payload: response.data });

            return response?.data;
        }
    })
    .catch((error) => {
        console.log('Login', error);
    });
}

export const logout = () => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: LOGOUT });

            resolve();
        } catch (error) {
            console.log('Logging User Out', error);
            reject(error);
        }
    });
}