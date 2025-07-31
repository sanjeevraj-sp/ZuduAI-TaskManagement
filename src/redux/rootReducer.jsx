import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import taskReducer from "./slices/taskSlice";

const appReducer = combineReducers({
  auth: authReducer,
  task: taskReducer
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
