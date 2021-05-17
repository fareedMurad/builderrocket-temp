import api from '../api';
import {
    GET_UTILITIES, GET_UTILITY_TYPES
} from './types';

export const getUtilities = () => dispatch => {
    const URL = '/utility';

    return api({
        method: 'GET',
        url: URL
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_UTILITIES, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        console.log('Getting Utilities', error);
    })

}

export const getUtilityTypes = () => dispatch => {
    const URL = '/UtilityType';

    return api({
        method: 'GET',
        url: URL
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_UTILITY_TYPES, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        console.log('Getting Utility Types', error);
    })

}