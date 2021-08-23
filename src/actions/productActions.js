import { 
    LOGOUT,
    SET_PRODUCT,
    GET_CATEGORIES,
    SEARCH_PRODUCTS,
    SET_PRODUCT_DETAILS,
    GET_CHILD_CATEGORIES,
    SET_SELECTED_CATEGORY_ID
} from '../actions/types';
import api from '../api';

export const getCategories = (categoryID) => dispatch => {
    let URL = '/Product/Category';

    if (categoryID)
        URL = URL + `/${categoryID}`;

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
    if (!categoryID) return;

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

export const searchProducts = (categoryID, searchObject) => dispatch => {
    const URL = `/Product/${categoryID ? categoryID : 'Search'}`;
    
    return api({
        method: 'POST',
        url: URL,
        data: searchObject
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

export const setSelectedCategoryID = (categoryID) => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: SET_SELECTED_CATEGORY_ID, payload: categoryID });

            resolve(categoryID);
        } catch (error) {
            reject(error);
        }
    });
} 

export const setProduct = (product) => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: SET_PRODUCT, payload: product });

            resolve(product);
        } catch (error) {
            reject(error);
        }
    });
}

export const setProductDetails = (productDetails) => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: SET_PRODUCT_DETAILS, payload: productDetails });

            resolve(productDetails);
        } catch (error) {
            reject(error);
        }
    });
}

export const setCategories = (categories) => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: GET_CATEGORIES, payload: categories });

            resolve(categories);
        } catch (error) {
            reject(error);
        }
    });
}