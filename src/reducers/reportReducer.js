
import {
    SET_REPORTS_FILTR,
    GET_REPORTS_FILTER
} from "../actions/types";

const intialState = {
     reportFilters: {}
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
        default:
            return state;
    }
}

export default reportReducer;