
import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import * as actions from "../actions";
import FrontPage from "./FrontPage";
import Header from "./Header";
import PostIndex from "./PostComponents/PostIndex";
import ComposeEvent from './ComposeEvent';
import ComposeNews from './ComposeNews';
import ComposeAlert from './AlertComponents/ComposeAlert';
import ComposeClass from './ComposeClass';
import FeedItem from "./FeedComponents/FeedItem";
import Registration from './Registration';
import VerifyTeacher from './developersOnly/VerifyTeacher';
import Login from './Login';
import changePasswordComp from './changePassword';

import CreateClass from './developersOnly/CreateClass';
import SelectClasses from './SelectClasses';
import ClassContent  from "./ClassMenuComponents/ClassContent";
import ComposeClassContent from './ClassMenuComponents/ComposeClassContent';
import ClassContentItem from './ClassMenuComponents/ClassContentItem';
import Announcements from "./ClassMenuComponents/Announcements";
import ComposeClassAnnouncements from "./ClassMenuComponents/ComposeClassAnnouncements";
import VerifyStudents from './ClassMenuComponents/VerifyStudents';
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
          <Route exact path="/newEvent" component={ComposeEvent} />
          <Route exact path="/newNews" component={ComposeNews} />
          <Route exact path="/newAlert" component={ComposeAlert} />
          <Route exact path="/posts" component={PostIndex} />
          <Route path="/feed" component={FeedItem} />
          <Route exact path="/register" component={Registration} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/classDBInput" component={CreateClass} />
          <Route path="/ClassContent/" component={ClassContent} />
          <Route path="/ContentItem" component={ClassContentItem} />
          <Route path="/ComposeClassContent" component={ComposeClassContent} />
          <Route path="/ClassAnnouncements" component={Announcements} />
          <Route path="/ComposeClassAnnouncement" component={ComposeClassAnnouncements} />
          <Route exact path="/VerifyTeacher" component={VerifyTeacher} />
          <Route exact path="/newClassSection" component={ComposeClass} />
          <Route exact path="/selectClasses" component={SelectClasses} />
          <Route path="/VerifyStudents" component={VerifyStudents} />
          <Route path="/profile" component={Profile} />
          <Route path="/changePassword/:id" component={changePasswordComp} />

        </div>
        
      </BrowserRouter>
    );
  }
}

export default App;

