
import {
    SET_REPORTS_FILTR,
    GET_REPORTS_FILTER, SET_ROOMS_FILTR, GET_ROOMS_FILTER
} from "../actions/types";

const intialState = {
     reportFilters: [],
     roomFilters: []
}

const reportReducer = (state = intialState, action) => {
    switch(action.type) {
        case SET_REPORTS_FILTR: {
            return {
                ...state,
                reportFilters: action.payload
            }
        }
        case GET_REPORTS_FILTER: {
            return {
                ...state,
                reportFilters: action.payload
            }
        }
        case SET_ROOMS_FILTR: {
            return {
                ...state,
                roomFilters: action.payload
            }
        }
        case GET_ROOMS_FILTER: {
            return {
                ...state,
                roomFilters: action.payload
            }
        }
        default:
            return state;
    }
}

export default reportReducer;
