import { GET_UTILITIES, GET_UTILITY_TYPES } from '../actions/types';

const intialState = {
    utilities: [],
    utilityTypes: []
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
        default: 
            return state;
    }
};

export default utilitiesReducer;