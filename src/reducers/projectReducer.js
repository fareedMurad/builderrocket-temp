import { GET_PROJECTS } from '../actions/types';

const intialState = {
    project: {},
    projects: []
};

const projectReducer = (state = intialState, action) => {
    switch (action.type) {
        case GET_PROJECTS: {
            return {
                ...state, 
                projects: action.payload
            }
        }
        default:
            return state;
    }
}

export default projectReducer;