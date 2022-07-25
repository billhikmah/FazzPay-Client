import { combineReducers } from "redux";
import authReducer from "./auth";
import userDataReducer from "./userData";

const reducers = combineReducers({
  auth: authReducer,
  user: userDataReducer
})

export default reducers