import { SUBMIT_POST } from "../actions/types";
export default function(state = {
    author: "",
    content: "",
    toBeUpdated: false
  }, action) {
  switch (action.type) {
    case SUBMIT_POST:
      return Object.assign({}, state, {
        data: action.post
      });
    default:
      return state;
  }
}