import axios from 'axios';
import { GET_PROJECTS, SET_SELECTED_PROJECT } from './types';

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

export const setSelectedProject = (selectedProject) => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: SET_SELECTED_PROJECT, payload: selectedProject });

            resolve(selectedProject);
        } catch (error) {
            console.log('Error Setting Project', error);
            reject(error);
        }
    })
}