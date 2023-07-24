import api from '../api';

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
    password,
    customerID
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
                return response?.data;
            }
        })
        .catch((error) => {
            console.log('Signup', error);
        });
}
