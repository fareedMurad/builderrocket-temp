import api from '../api';
import {
    CREATE_UTILITY,
    GET_UTILITIES, 
    GET_UTILITY_TYPES, 
    SET_SELECTED_UTILITY,
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
        if (error.response?.status === 401) 
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
        if (error.response?.status === 401) 
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
        if (error.response?.status === 401) 
            dispatch({ type: LOGOUT });
    })
}


export const deleteUtility = (utilityID) => dispatch => {
    const URL = `/Utility/${utilityID}`;

    return api({
        method: 'DELETE',
        url: URL
    })
    .then((response) => {
        if (response?.status === 200) {

            return response.data;
        }
    })
    .catch((error) => {
        if (error?.response?.status === 401) 
            dispatch({ type: LOGOUT });
    })
}

export const setSelectedUtility = (utility) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: SET_SELECTED_UTILITY, payload: utility });

        resolve();
    })
}

export const updateIsFavorite = (utality, IsFavorite) => dispatch => {
    const URL = `/utility/${utality?.ID}`;

    const data = [{
            op:"replace",
            path:"/IsFavorite",
            value: IsFavorite
    }]

    return api({
        method: 'PATCH',
        url: URL,
        data:data
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_UTILITIES, payload: response.data });
            return response.data;
        }
    })
    .catch((error) => {
        if (error?.response?.status === 401) 
            dispatch({ type: LOGOUT });
    })

}