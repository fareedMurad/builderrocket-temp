import { SET_VENDOR_SELECTED_PROJECT_TAB, LOGIN, SET_VENDOR,GET_CUSTOMER_DOCUMENTS, GET_CUSTOMER_PRODUCTS } from '../actions/types';

const intialState = {
    token: null,
    isSignedIn: false,
    selectedProjectTab: "products"
};

const vendorReducer = (state = intialState, action) => {
    switch (action.type) {
        case LOGIN:
            {
                return {
                    ...state,
                    // action.payload
                }
            }
        case SET_VENDOR:
            {
                return {
                    ...state,
                    token: action.payload,
                    isSignedIn: true
                }
            }
        case GET_CUSTOMER_DOCUMENTS: 
        {
            return {
                ...state,
                documents: action.payload
            }
        }
        case SET_VENDOR_SELECTED_PROJECT_TAB: {
            return {
                ...state, 
                selectedProjectTab: action.payload
            }
        }
        case GET_CUSTOMER_PRODUCTS: {
            return {
                ...state, 
                products: action.payload
            }
        }
        
        default:
            return state;
    }
}

export default vendorReducer;