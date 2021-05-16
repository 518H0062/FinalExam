import { FETCH_POSTS } from "../actions/types";
export default function(state = { data: [] }, action) {
  switch (action.type) {
    case FETCH_POSTS:
      return Object.assign({}, state, {
        data: action.posts
      });
    default:
      return state;
  }
}