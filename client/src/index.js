import materializeCSS from "./style-css/materialize.css";
import materializeJS from "materialize-css/dist/js/materialize.js";
import animateCSS from "animate.css";
import animeJS from "animejs";
import Quill from "quill";
import customStyles from "./style-css/style.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import App from "./components/App";
import store, { history } from "./store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
