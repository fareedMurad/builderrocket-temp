// import { LOGIN } from './types';
import axios from 'axios';

const baseURL = process.env.REACT_APP_BUILDER_ROCKET_API;

export const login = (email, password) => dispatch => {
    let URL = `${baseURL}/Login`;

    const loginResponse = axios({
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
        if (response?.status === 200)
            console.log('RESPONSE', response.data);
    })
    .catch((error) => {
        console.log('ERROR', error);
    });

    return loginResponse;
       
}