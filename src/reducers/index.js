import { combineReducers } from "redux";
import { LOGOUT } from "../actions/types";

// reducers
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import roomReducer from "./roomReducer";
import productReducer from "./productReducer";
import projectReducer from "./projectReducer";
import utilityReducer from "./utilityReducer";
import documentReducer from "./documentReducer";
import contractorReducer from "./contractorReducer";
import subdivisionReducer from "./subdivisionReducer";
import reportReducer from "./reportReducer";
import customerReducer from "./customerReducer";
import builderRoomsReducer from "./builderRooms";
import myProductReducer from "./myProductReducer";
import vendorReducer from "./vendorReducer";

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  room: roomReducer,
  project: projectReducer,
  product: productReducer,
  utility: utilityReducer,
  document: documentReducer,
  contractor: contractorReducer,
  subdivision: subdivisionReducer,
  reportFilter: reportReducer,
  customer: customerReducer,
  vendor: vendorReducer,
  builderRooms: builderRoomsReducer,
  myProduct: myProductReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    if (action?.payload) {
      state = {
        customer: action.payload,
      };
    } else state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
