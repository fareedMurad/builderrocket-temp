import { combineReducers  } from 'redux';
import { LOGOUT } from '../actions/types';
import authReducer from './authReducer';
import userReducer from './userReducer';
import projectReducer from './projectReducer';
import subdivisionReducer from './subdivisionReducer';

const appReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    project: projectReducer,
    subdivision: subdivisionReducer
})

const rootReducer = (state, action) => {
    if (action.type === LOGOUT) {
        state = undefined;
    }

    return appReducer(state, action);
}

export default rootReducer;