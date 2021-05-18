import api from '../api';
import { 
    GET_PROJECTS, 
    GET_PROJECT, 
    SET_SELECTED_PROJECT, 
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
        console.log('yoo', response);
    })
    .catch((error) => {
        if (error.response.status === 401) 
            dispatch({ type: LOGOUT });

        console.log('Getting Projects', error);
    })
}

export const getProjectByProjectNumber = (projectNumber, token) => dispatch => {
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
        if (error.response.status === 401) 
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