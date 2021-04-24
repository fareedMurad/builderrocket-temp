import { LOGIN, SET_USER } from '../actions/types';

const intialState = {
    token: null
};

const authReducer = (state = intialState, action) => {
    switch (action.type) {
        case LOGIN:
            {
                return {
                    ...state,
                    // action.payload
                }
            }
        case SET_USER:
            {
                return {
                    ...state,
                    token: action.payload
                }
            }
        default:
            return state;
    }
}

export default authReducer;