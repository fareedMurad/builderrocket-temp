import { 
    GET_CATEGORIES, 
    // GET_CHILD_CATEGORIES,
    SEARCH_PRODUCTS, 
    SET_SELECTED_CATEGORY_ID
} from '../actions/types';

const intialState = {
    products: [],
    productCategories: [],
    selectedCategoryID: ''
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
        default: 
            return state;
    }
}

export default productReducer;