import { FETCH_TEACHERS } from "../actions/types";
export default function(state = null, action) {
  switch (action.type) {
    case FETCH_TEACHERS:
      return Object.assign([], state, action.teachers);
    default:
      return state;
  }
}