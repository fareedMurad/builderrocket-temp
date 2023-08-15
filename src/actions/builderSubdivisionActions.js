import api from '../api';
import {
    LOGOUT,
    GET_MY_PRODUCTS_BY_PROJECT,
    GET_SUBDIVISIONS,
} from './types';

export const getBuilderSubdivisions = () => dispatch => {
    const URL = '/builder-subdivision/All';

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
            if (error.response?.status === 401)
                dispatch({ type: LOGOUT });
        })

}

export const getBuilderSubdivision = (SubdivisionID) => dispatch => {
    const URL = `/builder-subdivision/${SubdivisionID}`;

    return api({
        method: 'GET',
        url: URL
    })
        .then((response) => {
            if (response?.status === 200) {
                return response.data;
            }
        })
        .catch((error) => {
            if (error.response?.status === 401)
                dispatch({ type: LOGOUT });
        })

}

export const editBuilderSubdivsion = (subdivision) => dispatch => {
    const URL = `/builder-subdivision`;

    return api({
        method: 'PUT',
        url: URL,
        data: subdivision
    })
        .then((response) => {
            if (response?.status === 200) {
                return response.data;
            }
        })
        .catch((error) => {
            if (error.response?.status === 401)
                dispatch({ type: LOGOUT });
        })

}

export const createBuilderSubdivsion = (subdivision) => dispatch => {
    const URL = `/builder-subdivision/${subdivision}`;

    return api({
        method: 'POST',
        url: URL
    })
        .then((response) => {
            if (response?.status === 200) {
                return response.data;
            }
        })
        .catch((error) => {
            if (error.response?.status === 401)
                dispatch({ type: LOGOUT });
        })
}


export const deleteBuilderSubdivsion = (ID) => dispatch => {
    const URL = `/builder-subdivision/${ID}`;

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

/**
 * Add document to Subdivision
 * @param {*} ID - Selected Subdivision ID
 * @param {*} document - document data
 * @param onUploadProgress
 */
export const addBuilderSubdivsionDocument = (ID, document, onUploadProgress) => dispatch => {
    const URL = `/builder-subdivision/${ID}/document`;

    return api({
        method: 'POST',
        url: URL,
        data: document,
        onUploadProgress: onUploadProgress
    })
    .then((response) => {
        if (response?.status === 200) {
            return response.data;
        }

    })
    .catch((error) => {

    });
}

// export const setSelectedBuilderSubdivsion = (product) => dispatch => {
//     return new Promise((resolve, reject) => {
//         dispatch({ type: SET_SELECTED_MY_PRODUCT, payload: product });

//         resolve();
//     })
// }

/**
 * 
 * @param {*} SubdivisionID 
 * @param {*} ProjectID 
 * @returns 
 */
export const handleAddBuilderSubdivsionToProject = (SubdivisionID, ProjectID) => dispatch => {
    const URL = `/builder-subdivision/document/assigntoproject`;

    return api({
        method: 'PUT',
        url: URL,
        data: {
            SubdivisionID,
            ProjectID
        }
    })
        .then((response) => {
            if (response?.status === 200) {
                // dispatch({ type: SET_SELECTED_PROJECT, payload: response.data });

                return response?.data;
            }
        })
        .catch((error) => {
            if (error.response?.status === 401)
                dispatch({ type: LOGOUT });
        });
}


export const getBuilderSubdivsionsForProject = (ID) => dispatch => {
    const URL = `/builder-subdivision/projectproduct/${ID}`;

    return api({
        method: 'GET',
        url: URL
    })
        .then((response) => {
            if (response?.status === 200) {
                dispatch({ type: GET_MY_PRODUCTS_BY_PROJECT, payload: response.data });
                return response.data;
            }
        })
        .catch((error) => {
            if (error.response?.status === 401)
                dispatch({ type: LOGOUT });
        })

}


export const updateBuilderSubdivsionsForProject = (params) => dispatch => {
    const URL = `/builder-subdivision/projectproduct`;

    return api({
        method: 'PUT',
        url: URL,
        data: params
    })
        .then((response) => {
            if (response?.status === 200) {
                return response.data;
            }
        })
        .catch((error) => {
            if (error.response?.status === 401)
                dispatch({ type: LOGOUT });
        })

}

export const deleteBuilderSubdivsionsForProject = (ID) => dispatch => {
    const URL = `/builder-subdivision/projectproduct/${ID}`;

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
            if (error.response?.status === 401)
                dispatch({ type: LOGOUT });
        })

}