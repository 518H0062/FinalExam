import React, { Component } from "react";
import AlertSection from "./AlertSection";
import Fixedmenu from "./Fixedmenu";
import Newsfeed from "./FeedComponents/Newsfeed";
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';

class FrontPage extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    this.props.fetchUser();
  }
  render() {
    return (
      <div id="content-section-container" className="container">
        <div className="row" id="content-area-row">
          <div className="col s2 m2 l2 xl2">
            <Fixedmenu />
          </div>
          <Newsfeed pollInterval = {5000}/>
          <AlertSection />
        </div>
      </div>
    );
  }
}

export default withRouter(connect(null, actions)(FrontPage));
