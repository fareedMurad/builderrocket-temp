import { 
    GET_PROJECTS, 
    GET_PROJECT,
    SET_SELECTED_PROJECT, 
    RESET_PROJECT 
} from '../actions/types';

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
        case GET_PROJECT: {
            return {
                ...state, 
                project: action.payload
            }
        }
        case SET_SELECTED_PROJECT: {
            return {
                ...state, 
                project: action.payload
            }
        }
        case RESET_PROJECT: {
            return {
                ...state, 
                project: {}
            }
        }
        default:
            return state;
    }
}

export default projectReducer;