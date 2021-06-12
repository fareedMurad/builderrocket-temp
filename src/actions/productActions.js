import { 
    LOGOUT,
    SEARCH_PRODUCTS,
    GET_CUSTOM_FILTERS,
    SET_SELECTED_TEMPLATE_ITEM
} from '../actions/types';
import api from '../api';

export const getCustomFilters = (categoryID) => dispatch => {
    const URL = `/Product/${categoryID}`;

    return api({
        method: 'GET',
        url: URL
    })
    .then((response) => {
        if (response.status === 200) {
            dispatch({ type: GET_CUSTOM_FILTERS, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        if (error?.response?.status === 401) 
            dispatch({ type: LOGOUT });
    });
}

export const searchProducts = (filters) => dispatch => {
    const URL = '/Product/Search';

    return api({
        method: 'POST',
        url: URL,
        data: filters
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