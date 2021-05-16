import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import authReducer from "./authReducer";
import fetchPostReducer from "./fetchPostReducer";
import submitReducer from './submitPostReducer';
import fetchClassesReducer from './fetchClassesReducer';
import fetchAdminReducer from './fetchAdminReducer';
import fetchTeacherReducer from './fetchTeacherReducer';

export default combineReducers({
  user: authReducer,
  teachers: fetchTeacherReducer,
  admins: fetchAdminReducer,
  classes: fetchClassesReducer,
  postlist: fetchPostReducer,
  post: submitReducer,
  routing: routerReducer
});
