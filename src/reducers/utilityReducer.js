import { GET_UTILITIES } from '../actions/types';

const intialState = {
    utilities: []
}

const utilitiesReducer = (state = intialState, action) => {
    switch (action.type) {
        case GET_UTILITIES: {
            return {
                ...state, 
                utilities: action.payload
            }
        }
        default: 
            return state;
    }
};

export default utilitiesReducer;