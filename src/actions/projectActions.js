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

        console.log('Getting Projects', error);
    })
}

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

        console.log('Get Project By Number', error);
    });
}

export const setSelectedProject = (selectedProject) => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: SET_SELECTED_PROJECT, payload: selectedProject });

            resolve(selectedProject);
        } catch (error) {
            console.log('Error Setting Project', error);
            reject(error);
        }
    });
}

export const resetProject = () => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: RESET_PROJECT });

            resolve();
        } catch (error) {
            console.log('Error Project Reset', error);
            reject(error);
        }
    });
}

export const setSelectedProjectTab = (tab) => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: SET_SELECTED_PROJECT_TAB, payload: tab });

            resolve();
        } catch (error) {
            console.log('Selected Project Tab', error);
            reject(error);
        }
    });
}

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

        console.log('Save Rooms', error);
    });
}

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

        console.log('Delete Rooms', error);
    });
}

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