import axios from 'axios';
import {
    GET_SUBDIVISIONS
} from './types';

const baseURL = process.env.REACT_APP_BUILDER_ROCKET_API;

export const getSubdivisions = () => dispatch => {
    let URL = `${baseURL}/Subdivision`;

    return axios({
        method: 'GET', 
        url: URL
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_SUBDIVISIONS, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {

    });
}