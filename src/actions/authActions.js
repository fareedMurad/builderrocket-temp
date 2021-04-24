// import { LOGIN } from './types';
import axios from 'axios';

const baseURL = process.env.REACT_APP_BUILDER_ROCKET_API;

export const login = (email, password) => dispatch => {
    let URL = `${baseURL}/Login`;

    const loginResponse = axios({
        method: 'POST', 
        url: URL,
        headers: { 'Content-Type': 'application/json' },
        data: {
            Email: email, 
            Password: password
        }
    })
    .then((response) => {
        console.log('RESPONSE', response);
    })
    .catch((error) => {
        console.log('ERROR', error);
    });

    return loginResponse;
       
}