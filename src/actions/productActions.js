import { 
    LOGOUT,
    SET_PRODUCT,
    SET_PRODUCTS,
    GET_CATEGORIES,
    SEARCH_PRODUCTS,
    SET_PRODUCT_DETAIL,
    GET_CHILD_CATEGORIES,
    SET_SELECTED_CATEGORY_ID,
    SET_SELECTED_PRODUCT_TAB,
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
    let URL = '/Product'; 
    
    if (categoryID) {
        URL = `${URL}/${categoryID}`;
    }  
    
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

export const setProducts = (products) => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: SET_PRODUCTS, payload: products });

            resolve(products);
        } catch (error) {

        }
    });
}

export const setProductDetail = (productDetail) => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: SET_PRODUCT_DETAIL, payload: productDetail });

            resolve(productDetail);
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

export const getProductDetails = (productID) => dispatch => {
    if (!productID) return;

    const URL = `/Product/${productID}/details`;

    return api({
        method: 'GET',
        url: URL
    })
    .then((response) => {
        if (response.status === 200) {
            dispatch({ type: SET_PRODUCT_DETAIL, payload: response.data });

            return response.data;
        }
    })
    .catch((error) => {
        if (error?.response?.status === 401) 
            dispatch({ type: LOGOUT });
    });
}

export const setSelectedProductTab = (selectedProductTab) => dispatch => {
    if (!selectedProductTab) return;

    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: SET_SELECTED_PRODUCT_TAB, payload: selectedProductTab });

            resolve(selectedProductTab);
        } catch (error) {
            reject(error);
        }
    })
}