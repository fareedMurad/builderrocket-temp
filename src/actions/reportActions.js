
import {
    SET_REPORTS_FILTR,
    GET_REPORTS_FILTER
} from "./types"

export const setReportFilter = (filter) => dispatch => {
    return new Promise((resolve, reject) => {
        try {
            dispatch({ type: SET_REPORTS_FILTR, payload: filter });

            resolve(filter);
        } catch (error) {
            reject(error);
        }
    });
}

export const getReportFilter = (filter) => dispatch => {
    dispatch({ type: GET_REPORTS_FILTER, payload: filter });
}