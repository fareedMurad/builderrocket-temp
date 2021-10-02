import api from '../api';
import { 
    SET_SELECTED_PROJECT_TAB,
    SET_SELECTED_PROJECT, 
    DELETE_PROJECT_ROOMS,
    ADD_PROJECT_ROOMS,
    GET_PROJECTS, 
    GET_PROJECT, 
    RESET_PROJECT, 
    LOGOUT
} from './types';

/**
 * Get users projects for user logged in
 * 
 */
export const getProjects = () => dispatch => {
    const URL = '/Project';

    return api({
        method: 'GET', 
        url: URL
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_PROJECTS, payload: response?.data });

            return response?.data;
        }
    })
    .catch((error) => {
        if (error.response?.status === 401) 
            dispatch({ type: LOGOUT });
    })
}

/**
 * Get project by project number  
 * @param {*} projectNumber 
 *
 */
export const getProjectByProjectNumber = (projectNumber) => dispatch => {
    const URL = `/Project/${projectNumber}`;

    return api({
        method: 'GET', 
        url: URL
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_PROJECT, payload: response?.data });

            return response?.data;
        }
    })
    .catch((error) => {
        if (error.response?.status === 401) 
            dispatch({ type: LOGOUT });
    });
}

/**
 * Get project by project ID  
 * @param {String} projectID 
 *
 */
 export const getProjectByProjectID = (projectID) => dispatch => {
    const URL = `/Project/${projectID}`;

    return api({
        method: 'GET', 
        url: URL
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_PROJECT, payload: response?.data });

            return response?.data;
        }
    })
    .catch((error) => {
        if (error.response?.status === 401) 
            dispatch({ type: LOGOUT });
    });
}

export const setSelectedProject = (selectedProject) => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: SET_SELECTED_PROJECT, payload: selectedProject });

            resolve(selectedProject);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 
 * Resets project to intial state
 */
export const resetProject = () => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: RESET_PROJECT });

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Sets selected project tab 
 * @param {*} tab  
 */
export const setSelectedProjectTab = (tab) => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: SET_SELECTED_PROJECT_TAB, payload: tab });

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Adds rooms to selected project
 * @param {*} projectID 
 * @param {*} rooms 
 */
export const addRoomsToProject = (projectID, rooms) => dispatch => {
    const URL = `/Project/${projectID}/AddRooms`;

    return api({
        method: 'POST',
        url: URL,
        data: rooms
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: ADD_PROJECT_ROOMS, payload: response?.data });

            return response?.data;
        }
    })
    .catch((error) => {
        if (error.response?.status === 401) 
            dispatch({ type: LOGOUT });
    });
}

/**
 * Deletes rooms from a selected project
 * @param {*} projectID 
 * @param {*} rooms 
 */
export const deleteRoomsFromProject = (projectID, rooms) => dispatch => {
    const URL = `/Project/${projectID}/RemoveRooms`;

    return api({
        method: 'DELETE',
        url: URL,
        data: rooms
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: DELETE_PROJECT_ROOMS, payload: response?.data });

            return response?.data;
        }
    })
    .catch((error) => {
        if (error.response?.status === 401) 
            dispatch({ type: LOGOUT });
    });
}

/**
 * 
 * @param {*} product 
 * @returns 
 */
export const handleProductForProject = (product) => dispatch => {
    const URL = `/Project/Room/product`;

    return api({
        method: 'POST', 
        url: URL,
        data: product
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: SET_SELECTED_PROJECT, payload: response.data });

            return response?.data;
        }
    })
    .catch((error) => {
        if (error.response?.status === 401) 
            dispatch({ type: LOGOUT }); 
    });
}

/**
 * Save / Update existing project
 * @param project - project object contaning ID
 * 
 */
export const saveProject = (project) => dispatch => {
    if (!project.ID) return;
 
    const URL = `/Project/${project.ID}`;

    return api({
        method: 'POST', 
        url: URL, 
        data: project
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: SET_SELECTED_PROJECT, payload: response.data });

            return response?.data;
        }
    })
    .catch((error) => {
        if (error.response?.status === 401) 
            dispatch({ type: LOGOUT }); 
    });
}

/**
 * Update Project
 * @param {Object} project 
 * @returns 
 */
export const updateProject = (project) => dispatch => {
    if (!project.ID) return;
 
    const URL = `/Project/${project.ID}`;

    return api({
        method: 'PATCH', 
        url: URL, 
        data: project
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: SET_SELECTED_PROJECT, payload: response.data });

            return response?.data;
        }
    })
    .catch((error) => {
        if (error.response?.status === 401) 
            dispatch({ type: LOGOUT }); 
    });
}

/**
*   Create a copy of project 
* @param projectID - ID of project to copy
* @param projectName - Key value pair object of project name { projectName: 'NAME' }
*/
export const copyProject = (projectID, projectName) => dispatch => {
    if (!projectID) return;

    const URL = `/Project/${projectID}/Copy`;

    return api({
        method: 'POST',
        url: URL, 
        data: projectName
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: SET_SELECTED_PROJECT, payload: response.data });

            return response?.data;
        }
    })
    .catch((error) => {
        if (error.response?.status === 401) 
            dispatch({ type: LOGOUT }); 
    });
}

/**
 * 
 * @param {String} projectID 
 * @param {*} thumbnail - thumbnail data
 * @returns 
 */
export const uploadProjectThumbnail = (projectID, thumbnail) => async dispatch => {
    if (!projectID) return;

    const URL = `/Project/${projectID}/thumbnail`;

    try {
        const response = await api({
            method: 'POST',
            url: URL,
            data: thumbnail
        });
        if (response.status === 200) {
            dispatch({ type: SET_SELECTED_PROJECT, payload: response.data });

            return response.data;
        }
    } catch (error) { }
}

/**
 * 
 * @param {Array} items - product items to be updated
 * @returns Project 
 */
export const editProduct = (items) => dispatch => {
    const URL = '/Project/Room/Product';

    return api({
        method: 'POST',
        url: URL,
        data: items
    })
    .then((response) => {
        if (response.status === 200) {
            dispatch({ type: SET_SELECTED_PROJECT, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        if (error.response?.status === 401) 
            dispatch({ type: LOGOUT }); 
    });
}

/**
 * 
 * @param {Object} newProject 
 * @returns 
 */
export const createProject = (newProject) => dispatch => {
    const URL = '/Project';

    return api({
        method: 'POST', 
        url: URL, 
        data: newProject
    })
    .then((response) => {
        if (response.status === 200) {
            dispatch({ type: SET_SELECTED_PROJECT, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        console.log('ERROR', error);

        if (error.response?.status === 401) 
            dispatch({ type: LOGOUT }); 
    })
} 