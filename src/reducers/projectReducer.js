import { 
    GET_PROJECT,
    GET_REPORT,
    GET_PROJECTS, 
    RESET_PROJECT,
    ADD_PROJECT_ROOMS,
    SET_SELECTED_PROJECT,
    SET_REFRESH_THUMBNAIL,
    SET_SELECTED_PROJECT_TAB, 
    DELETE_PROJECT_ROOMS,
    GET_LOGOS,
    GET_CATEGORIZED_REPORT,
    GET_ROOM_REPORT,
    GET_VENDOR_REPORT

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
        Rooms: []
    },
    projects: [],
    selectedProjectTab: 'projectInformation',
    refreshThumbnail: false,
    logos: [],
};

const projectReducer = (state = intialState, action) => {
    switch (action.type) {
        case GET_LOGOS: {
            return {
                ...state, 
                logos: action.payload
            }
        }
        case GET_PROJECTS: {
            return {
                ...state, 
                projects: action.payload
            }
        }
        case GET_PROJECT: {
            return {
                ...state, 
                project: action.payload,
                originalProject: action.payload,
            }
        }
        case GET_REPORT: {
            return {
                ...state, 
                report: action.payload
            }
        }
        case GET_CATEGORIZED_REPORT: {
            return {
                ...state, 
                reportByCategory: action.payload
            }
        }
        case GET_VENDOR_REPORT: {
            return {
                ...state, 
                reportsByVendor: action.payload
            }
        }
        case GET_ROOM_REPORT: {
            return {
                ...state, 
                reportByRoom: action.payload
            }
        }
        case SET_SELECTED_PROJECT: {
            return {
                ...state, 
                project: action.payload,
                originalProject: action.payload,
            }
        }
        case RESET_PROJECT: {
            return {
                ...state, 
                project: intialState.project,
                originalProject: action.payload,
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
                project: action.payload,
                originalProject: action.payload,
            }
        }
        case DELETE_PROJECT_ROOMS: {
            return {
                ...state, 
                project: action.payload,
                originalProject: action.payload,
            }
        }
        case SET_REFRESH_THUMBNAIL: {
            return {
                ...state, 
                refreshThumbnail: action.payload,
            }
        }
        default:
            return state;
    }
}

export default projectReducer;
