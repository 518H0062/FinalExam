import axios from "axios";
import { FETCH_USER, FETCH_TEACHERS, FETCH_ADMINS, FETCH_POSTS, 
  FETCH_CLASSES, SUBMIT_POST } from "./types";

export const fetchUser = () => async dispatch => {
  const res = await axios.get("/api/current_user");
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchPosts = (url) => async dispatch => {
  const res = await axios.get(url);
  dispatch({ type: FETCH_POSTS, posts: res.data });
};

export const fetchClasses = (userId) => async dispatch => {
  const res = await axios.get(`${"/api/user_classes"}/${userId}`);
  dispatch({ type: FETCH_CLASSES, classes: res.data });
};

export const fetchTeachers = () => async dispatch => {
  const res = await axios.get("/api/teacher-list");
  dispatch({ type: FETCH_TEACHERS, teachers: res.data });
};

export const fetchAdmins = () => async dispatch => {
  const res = await axios.get("/api/admin-list");
  dispatch({ type: FETCH_ADMINS, admins: res.data });
};

export const submitPost = (url, post) => async dispatch => {
  const res = await axios.post(url, post).catch(err => { console.error(err);});
  dispatch({ type: SUBMIT_POST, announcements: res.data})
};
