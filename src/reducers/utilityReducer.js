import { 
    GET_UTILITIES, 
    GET_UTILITY_TYPES,
    SET_SELECTED_UTILITY
} from '../actions/types';

const intialState = {
    utilities: [],
    utilityTypes: [],
    utility: {}
}

const utilitiesReducer = (state = intialState, action) => {
    switch (action.type) {
        case GET_UTILITIES: {
            return {
                ...state, 
                utilities: action.payload
            }
        }
        case GET_UTILITY_TYPES: {
            return {
                ...state, 
                utilityTypes: action.payload
            }
        }
        case SET_SELECTED_UTILITY: {
            return {
                ...state, 
                utility: action.payload
            }
        }
        default: 
            return state;
    }
};

export default utilitiesReducer;