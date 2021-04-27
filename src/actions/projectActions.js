import { GET_PROJECTS } from './types';
import axios from 'axios';

const baseURL = process.env.REACT_APP_BUILDER_ROCKET_API;
const token = process.env.REACT_APP_BUILDER_ROCKET_TOKEN;

export const getProjects = () => dispatch => {
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