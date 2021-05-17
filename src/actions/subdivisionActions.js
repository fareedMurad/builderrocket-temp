import api from '../api';
import {
    GET_SUBDIVISIONS
} from './types';

export const getSubdivisions = () => dispatch => {
    const URL = '/Subdivision';

    return api({
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