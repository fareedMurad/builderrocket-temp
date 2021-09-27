import { 
    GET_PROJECT,
    GET_PROJECTS, 
    RESET_PROJECT,
    ADD_PROJECT_ROOMS,
    SET_SELECTED_PROJECT,
    SET_SELECTED_PROJECT_TAB, 
    DELETE_PROJECT_ROOMS
} from '../actions/types';

const intialState = {
    project: {
        BuildingPermitNumber: '',
        BuildingRiskPolicy: '',
        City: '',
        CloseDate: '',
        Contractors: {},
        Customers: [],
        DateCreated: '',
        Documents: [],
        ID: '',
        Images: [],
        LocatePermitNumber: '',
        LotNumber: '',
        OccupencyDate: '',
        PermitDate: '',
        PlanName: '',
        ProjectName: '',
        ProjectNumber: '',
        ProjectRooms: [],
        SepticPermitNumber: '',
        State: '',
        Status: '',
        StatusID: '',
        StreetAddress1: '',
        StreetAddress2: '',
        Subdivision: '',
        TaxMapNumber: '',
        ThumbnailName: '',
        ThumbnailURL: '',
        UserID: '',
        Zip: '',
    },
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
                project: intialState.project
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
        case DELETE_PROJECT_ROOMS: {
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