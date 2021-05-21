import { 
    GET_CONTRACTORS,
    GET_CONTRACTOR_TYPES
} from '../actions/types';

const intialState = {
    contractors: [],
    contractorTypes: []
}

const contractorReducer = (state = intialState, action) => {
    switch (action.type) {
        case GET_CONTRACTORS: {
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
        default: 
            return state;
    }
};

export default contractorReducer;