import { 
    CREATE_CONTRACTOR,
    GET_CONTRACTORS,
    GET_CONTRACTOR_TYPES,
    SET_SELECTED_CONTRACTOR
} from '../actions/types';

const intialState = {
    contractors: [],
    contractorTypes: [],
    contractor: {}
}

const contractorReducer = (state = intialState, action) => {
    switch (action.type) {
        case GET_CONTRACTORS: {
            return {
                ...state, 
                contractors: action.payload
            }
        }
        case CREATE_CONTRACTOR: {
            return {
                ...state, 
                contractors: action.payload
            }
        }
        case GET_CONTRACTOR_TYPES: {
            return {
                ...state, 
                contractorTypes: action.payload   
            }
        }
        case SET_SELECTED_CONTRACTOR: {
            return {
                ...state, 
                contractor: action.payload
            }
        }
        default: 
            return state;
    }
};

export default contractorReducer;