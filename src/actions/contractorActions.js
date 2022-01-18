import api from '../api';
import { 
    GET_CONTRACTORS,
    GET_CONTRACTOR_TYPES,
    CREATE_CONTRACTOR,
    SET_SELECTED_CONTRACTOR,
    LOGOUT
} from './types';

export const getContractors = () => dispatch => {
    const URL = '/contractor';

    return api({
        method: 'GET', 
        url: URL
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_CONTRACTORS, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        if (error.response?.status === 401) 
            dispatch({ type: LOGOUT });

    });
}

export const getContractorTypes = () => dispatch => {
    const URL = '/ContractorType';

    return api({
        method: 'GET',
        url: URL
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_CONTRACTOR_TYPES, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        if (error.response?.status === 401) 
            dispatch({ type: LOGOUT });

    });

}

export const createContractor = (contractor) => dispatch => {
    const URL = '/contractor';

    return api({
        method: 'POST',
        url: URL,
        data: contractor
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: CREATE_CONTRACTOR, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        if (error.response?.status === 401) 
            dispatch({ type: LOGOUT });
    })
}


export const deleteContractor = (contractorID) => dispatch => {
    const URL = `/Contractor/${contractorID}`;

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

export const setSelectedContractor = (contractor) => dispatch => {
    dispatch({ type: SET_SELECTED_CONTRACTOR, payload: contractor });
}

export const updateIsFavorite = (contractor, IsFavorite) => dispatch => {
    const URL = `/contractor/${contractor?.ID}`;

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
            dispatch({ type: GET_CONTRACTORS, payload: response.data });
            return response.data;
        }
    })
    .catch((error) => {
        if (error?.response?.status === 401) 
            dispatch({ type: LOGOUT });
    })
}