import {GET_REPORTS_FILTER, GET_ROOMS_FILTER, SET_REPORTS_FILTER, SET_ROOMS_FILTER, SET_CUSTOMER_FILTER, GET_CUSTOMER_FILTER} from "../actions/types";

const initialState = {
    reportFilters: [],
    roomFilters: [],
    isCustomer: false
}

const reportReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_REPORTS_FILTER: {
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
        case SET_ROOMS_FILTER: {
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
        case SET_CUSTOMER_FILTER: {
            return {
                ...state,
                isCustomer: action.payload
            }
        }
        case GET_CUSTOMER_FILTER: {
            return {
                ...state,
                isCustomer: action.payload
            }
        }
        default:
            return state;
    }
}

export default reportReducer;
