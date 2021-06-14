import { 
    LOGOUT,
    SEARCH_PRODUCTS,
    GET_CATEGORIES,
    GET_CHILD_CATEGORIES,
    SET_SELECTED_TEMPLATE_ITEM
} from '../actions/types';
import api from '../api';

export const getCategories = () => dispatch => {
    const URL = '/Product/Category';

    return api({
        method: 'GET',
        url: URL
    })
    .then((response) => {
        if (response.status === 200) {
            dispatch({ type: GET_CATEGORIES, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        if (error?.response?.status === 401) 
            dispatch({ type: LOGOUT });
    });
}

export const getChildCategories = (categoryID) => dispatch => {
    const URL = `/Product/Category/${categoryID}`;

    return api({
        method: 'GET',
        url: URL
    })
    .then((response) => {
        if (response.status === 200) {
            dispatch({ type: GET_CHILD_CATEGORIES, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        if (error?.response?.status === 401) 
            dispatch({ type: LOGOUT });
    });

}

export const searchProducts = (categoryID) => dispatch => {
    const URL = `/Product/${categoryID ? categoryID : 'Search'}`;

    return api({
        method: 'POST',
        url: URL
    })
    .then((response) => {
        if (response.status === 200) {
            dispatch({ type: SEARCH_PRODUCTS, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        if (error?.response?.status === 401) 
            dispatch({ type: LOGOUT });
    });
}

export const setSelectedTemplateItem = (templateItem) => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: SET_SELECTED_TEMPLATE_ITEM, payload: templateItem });

            resolve(templateItem);
        } catch (error) {
            reject(error);
        }
    });
} 