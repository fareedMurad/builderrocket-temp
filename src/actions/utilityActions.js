import api from '../api';
import {
    CREATE_UTILITY,
    GET_UTILITIES, 
    GET_UTILITY_TYPES, 
    LOGOUT
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
        if (error.response.status === 401) 
            dispatch({ type: LOGOUT });

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
        if (error.response.status === 401) 
            dispatch({ type: LOGOUT });

        console.log('Getting Utility Types', error);
    })

}

export const createUtility = (utility) => dispatch => {
    const URL = '/utility';

    return api({
        method: 'POST',
        url: URL,
        data: utility
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: CREATE_UTILITY, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        if (error.response.status === 401) 
            dispatch({ type: LOGOUT });
    })
}