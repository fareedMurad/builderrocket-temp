import api from '../api';
import { GET_DOCUMENT_TYPES } from './types';

export const getDocumentTypes = () => dispatch => {    
    const URL = '/DocumentType';

    return api({
        method: 'GET',
        url: URL
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_DOCUMENT_TYPES, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {

    });
}

export const addDocument = (projectID, document) => dispatch => {    
    const URL = `/Project/${projectID}/document`;

    return api({
        method: 'POST',
        url: URL,
        data: document
    })
    .then((response) => {
        if (response?.status === 200) {
            console.log('Add Document', response);

            return response.data;
        }
    })
    .catch((error) => {

    });
}

export const deleteDocument = (documentID) => dispatch => {    
    const URL = `/Document/${documentID}`;

    return api({
        method: 'DELETE',
        url: URL
    })
    .then((response) => {
        if (response?.status === 200) {
            console.log('Deleted Document', response);

            return response.data;
        }
    })
    .catch((error) => {

    });
}