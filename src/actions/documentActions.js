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

            console.log('Get Document Types', response);

            return response.data;
        }
    })
    .catch((error) => {

    });
}

export const addDocument = (projectID, documents) => dispatch => {    
    const URL = `/Project/${projectID}/document`;

    return api({
        method: 'POST',
        URL: URL,
        data: documents
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