import { 
    SEARCH_PRODUCTS, 
    GET_CUSTOM_FILTERS, 
    SET_SELECTED_TEMPLATE_ITEM
} from '../actions/types';

const intialState = {
    products: [],
    productFilters: [],
    selectedTemplateItem: {}
}

const productReducer = (state = intialState, action) => {
    switch (action.type) {
        case GET_CUSTOM_FILTERS: {
            return {
                ...state, 
                productFilters: action.payload
            }
        }
        case SEARCH_PRODUCTS: {
            return {
                ...state,
                products: action.payload
            }
        }
        case SET_SELECTED_TEMPLATE_ITEM: {
            return {
                ...state, 
                selectedTemplateItem: action.payload
            }
        }
        default: 
            return state;
    }
}

export default productReducer;