import { FETCH_ADMINS } from "../actions/types";
export default function(state = null, action) {
  switch (action.type) {
    case FETCH_ADMINS:
      return Object.assign([], state, action.admins);
    default:
      return state;
  }
}