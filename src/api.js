import axios from 'axios';
import store from './store';

// Get redux state
const state = store.getState();
// Get token from redux state
const token = state.auth.token;

const baseURL = process.env.REACT_APP_BUILDER_ROCKET_API;

export default axios.create({
    baseURL: baseURL,
    headers: {
        Authorization: `Bearer ${token}`
    }
  });