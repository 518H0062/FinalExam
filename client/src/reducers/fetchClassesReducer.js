import { FETCH_CLASSES } from "../actions/types";
export default function(state = null, action) {
  switch (action.type) {
    case FETCH_CLASSES:
      return Object.assign([], state, action.classes
      );
    default:
      return state;
  }
}