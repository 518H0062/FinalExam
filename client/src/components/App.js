import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import * as actions from "../actions";
import FrontPage from "./FrontPage";
import Header from "./Header";
import PostIndex from "./PostComponents/PostIndex";
import ComposeNews from './ComposeNews';
import ComposeAlert from './AlertComponents/ComposeAlert';
import FeedItem from "./FeedComponents/FeedItem";
import Registration from './Registration';
import Login from './Login';
import changePasswordComp from './changePassword';
import Profile from './Profile';
class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <BrowserRouter>

        <div id="CSIBridge">
          <div id="page-background"></div>
          <Header />
          <Route exact={true} path="/" component={FrontPage} />
          <Route exact path="/newNews" component={ComposeNews} />
          <Route exact path="/newNews/:id" component={ComposeNews} />
          <Route exact path="/newAlert" component={ComposeAlert} />
          <Route exact path="/posts" component={PostIndex} />
          <Route path="/feed" component={FeedItem} />
          <Route exact path="/register" component={Registration} />
          <Route exact path="/login" component={Login} />
        
          <Route path="/profile" component={Profile} />
          <Route path="/changePassword/:id" component={changePasswordComp} />
        </div>
        
      </BrowserRouter>
    );
  }
}

export default App;
