import { createStore, applyMiddleware, compose } from "redux";
//import { syncHistoryWithStore } from "react-router-redux";
import reduxThunk from "redux-thunk";
import reducers from "./reducers";

const middleware = [reduxThunk];

const store = createStore(
  reducers,
  {},
  compose(
    applyMiddleware(...middleware)
  )
);

export default store;