import {
    GET_SUBDIVISIONS
} from '../actions/types';

const intialState = {
    subdivisions: []
}

const subdivisionReducer = (state = intialState, action) => {
    switch (action.type) {
        case GET_SUBDIVISIONS: {
            return {
                ...state, 
                subdivisions: action.payload
            }
        }
        default: 
            return state;
    }
};

export default subdivisionReducer;