import axios from 'axios';
import { 
    GET_PROJECTS, 
    GET_PROJECT, 
    SET_SELECTED_PROJECT, 
    RESET_PROJECT 
} from './types';

const baseURL = process.env.REACT_APP_BUILDER_ROCKET_API;

export const getProjects = (token) => dispatch => {
    let URL = `${baseURL}/Project`;

    return axios({
        method: 'GET', 
        url: URL,
        headers: { 
            Authorization: `Bearer ${token}`
        }
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_PROJECTS, payload: response?.data });

            return response?.data;
        }
    })
    .catch((error) => {
        console.log('Getting Projects', error);
    })
}

export const getProjectByProjectNumber = (projectNumber, token) => dispatch => {
    let URL = `${baseURL}/Project/${projectNumber}`;

    return axios({
        method: 'GET', 
        url: URL,
        headers: { 
            Authorization: `Bearer ${token}`
        }
    })
    .then((response) => {
        if (response?.status === 200) {
            dispatch({ type: GET_PROJECT, payload: response?.data });

            return response?.data;
        }
    })
    .catch((error) => {
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