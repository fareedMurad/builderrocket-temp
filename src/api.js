import axios from 'axios';
import store from './store';

const baseURL = "https://api-builderrocket.azurewebsites.net/v1" || process.env.REACT_APP_BUILDER_ROCKET_API;

const axiosInstance = axios.create({
    baseURL: baseURL
});

axiosInstance.interceptors.request.use((config) => {
    const token = store.getState().customer?.isSignedIn ? store.getState().customer.token  :  store.getState().auth.token;    
    config.headers.Authorization = `Bearer ${token}`;

    return config;
})

export default axiosInstance;