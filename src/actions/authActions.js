import api from '../api';
import { SET_USER, LOGOUT } from './types';

export const signupEmailPassword = ({

    firstName,
    lastName,
    userName,
    email,
    phoneNumber,
    company,
    streetAddress1,
    streetAddress2,
    city,
    state,
    zip,
    password
}) => dispatch => {
    const URL = '/Account';

    return api({
        method: 'POST',
        url: URL,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "FirstName": firstName,
            "LastName": lastName,
            "UserName": userName,
            "Email": email,
            "PhoneNumber": phoneNumber,
            "Company": company,
            "StreetAddress1": streetAddress1,
            "StreetAddress2": streetAddress2,
            "City": city,
            "State": state,
            "Zip": zip,
            "password": password,
        }
    })
        .then((response) => {
            if (response?.status === 200) {
                dispatch({ type: SET_USER, payload: response.data });

                return response?.data;
            }
        })
        .catch((error) => {
            console.log('Signup', error);
        });
}

export const loginEmailPassword = (email, password) => dispatch => {
    const URL = '/Login';

    return api({
        method: 'POST',
        url: URL,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            'Email': email,
            'Password': password
        }
    })
        .then((response) => {
            if (response?.status === 200) {
                dispatch({ type: SET_USER, payload: response.data });

                return response?.data;
            }
        })
        .catch((error) => {
            console.log('Login', error);
        });
}

export const logout = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: LOGOUT, payload: data });

            resolve();
        } catch (error) {
            console.log('Logging User Out', error);
            reject(error);
        }
    });
}