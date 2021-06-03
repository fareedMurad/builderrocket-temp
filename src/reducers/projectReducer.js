import { 
    GET_PROJECT,
    GET_PROJECTS, 
    RESET_PROJECT,
    ADD_PROJECT_ROOMS,
    SET_SELECTED_PROJECT,
    SET_SELECTED_PROJECT_TAB 
} from '../actions/types';

const intialState = {
    project: {},
    projects: [],
    selectedProjectTab: 'projectInformation'
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
        case SET_SELECTED_PROJECT_TAB: {
            return {
                ...state, 
                selectedProjectTab: action.payload
            }
        }
        case ADD_PROJECT_ROOMS: {
            return {
                ...state, 
                project: action.payload
            }
        }
        default:
            return state;
    }
}

export default projectReducer;