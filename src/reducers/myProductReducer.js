import { 
    GET_MY_PRODUCTS, 
    SET_SELECTED_MY_PRODUCT,
    GET_MY_PRODUCTS_BY_PROJECT
} from '../actions/types';

const intialState = {
    myProducts: [],
    selectedMyProduct: {},
    myProductsByProject: []
}

const myProductReducer = (state = intialState, action) => {
    switch (action.type) {
        case GET_MY_PRODUCTS: {
            return {
                ...state, 
                myProducts: action.payload
            }
        }
        case SET_SELECTED_MY_PRODUCT: {
            return {
                ...state, 
                selectedMyProduct: action.payload
            }
        }
        case GET_MY_PRODUCTS_BY_PROJECT: {
            return {
                ...state,
                myProductsByProject: action.payload
            }
        }
        default: 
            return state;
    }
};

export default myProductReducer;