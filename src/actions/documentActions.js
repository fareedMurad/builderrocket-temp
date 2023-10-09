import api from '../api';
import { GET_DOCUMENT_TYPES } from './types';

/**
 * Get document types
 * 
 */
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

/**
 * Add document to project
 * @param {*} projectID - Selected project ID
 * @param {*} document - document data
 * @param onUploadProgress
 */
export const addDocument = (projectID, document, onUploadProgress) => dispatch => {
    const URL = `/Project/${projectID}/document`;

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

/**
 * Delete document by document ID
 * @param {*} documentID 
 * 
 */
export const deleteDocument = (documentID) => dispatch => {    
    const URL = `/Document/${documentID}`;

    return api({
        method: 'DELETE',
        url: URL
    })
    .then((response) => {
        if (response?.status === 200) {
            return response.data;
        } 

        return;
    })
    .catch((error) => {

    });
}

// /**
//  * 
//  * @param {*} documentID - ID of selected document  
//  * @param {*} documentNameObj - Object of document name { userFileName: 'NEW NAME' }
//  *  
//  */
// export const renameDocument = (documentID, documentNameObj) => dispatch => {    
//     const URL = `/Document/${documentID}`;

//     return api({
//         method: 'PATCH',
//         url: URL,
//         data: documentNameObj
//     })
//     .then((response) => {
//         if (response?.status === 200) {
//             return response.data;
//         }

//         return;
//     })
//     .catch((error) => {

//     });
// }

/**
 * 
 * @param {*} documentNameObj - Object of document
 *  
 */
export const updateDocument = (documentNameObj) => dispatch => {    
    const URL = `/Document`;

    return api({
        method: 'PUT',
        url: URL,
        data: documentNameObj
    })
    .then((response) => {
        if (response?.status === 200) {
            return response.data;
        }

        return;
    })
    .catch((error) => {

    });
}

