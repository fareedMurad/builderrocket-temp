import { 
    SET_PRODUCT,
    SET_REPLACE_PRODUCT,
    SET_PRODUCTS,
    GET_CATEGORIES, 
    SEARCH_PRODUCTS, 
    SET_PRODUCT_DETAIL,
    SET_SELECTED_CATEGORY_ID,
    SET_SELECTED_PRODUCT_TAB,
    ROUGHT_IN_TRIM_OUT,
    IS_FAVORITE
} from '../actions/types';

const intialState = {
    products: [],
    productDetail: {},
    productCategories: [],
    selectedCategoryID: '',
    selectedProductTab: 'products',
    roughtInTrimOut: {},
    isFavorite: false
}

const productReducer = (state = intialState, action) => {
    switch (action.type) {
        case GET_CATEGORIES: {
            return {
                ...state, 
                productCategories: action.payload
            }
        }
        case SEARCH_PRODUCTS: {
            return {
                ...state,
                products: action.payload
            }
        }
        case SET_SELECTED_CATEGORY_ID: {
            return {
                ...state, 
                selectedCategoryID: action.payload
            }
        }
        case SET_PRODUCT: {
            return {
                ...state, 
                product: action.payload
            }
        }

        case SET_REPLACE_PRODUCT: {
            return {
                ...state, 
                replaceProduct: action.payload
            }
        }
        case SET_PRODUCTS: {
            return {
                ...state, 
                products: action.payload
            }
        }
        case SET_PRODUCT_DETAIL: {
            return {
                ...state, 
                productDetail: action.payload
            }
        }
        case SET_SELECTED_PRODUCT_TAB: {
            return {
                ...state, 
                selectedProductTab: action.payload
            }
        }
        case ROUGHT_IN_TRIM_OUT: {
            return {
                ...state,
                roughtInTrimOut: action.payload
            }
        }
        case IS_FAVORITE: {
            return {
                ...state,
                isFavorite: action.payload
            }
        }
        default: 
            return state;
    }
}

export default productReducer;