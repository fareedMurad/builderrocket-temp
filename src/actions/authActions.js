// import { LOGIN } from './types';
import axios from 'axios';
import { SET_USER } from './types';

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
            console.log('RESPONSE', response.data);

        }
    })
    .catch((error) => {
        console.log('Login Error', error);
    });
       
}

export const setUser = (token) => dispatch => {
    dispatch({ type: SET_USER, payload: token });
}