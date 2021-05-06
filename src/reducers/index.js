import { combineReducers  } from 'redux';
import { LOGOUT } from '../actions/types';
import authReducer from './authReducer';
import projectReducer from './projectReducer';

const appReducer = combineReducers({
    auth: authReducer,
    project: projectReducer
})

const rootReducer = (state, action) => {
    if (action.type === LOGOUT) {
        state = undefined;
    }

    return appReducer(state, action);
}

export default rootReducer;