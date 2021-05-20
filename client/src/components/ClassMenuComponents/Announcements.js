import React, { Component } from "react";
import { connect, connectAdvanced } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import axios from 'axios';
import Fixedmenu from "../Fixedmenu";
import Newsfeed from "../FeedComponents/Newsfeed";
import AlertSection from "../AlertSection";
import Quill from "quill";
import marked from 'marked';

class Announcements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _class: false,
      announcements: "",
      announcementsHTML: false,
      date: ""
    };
  }

  componentWillReceiveProps(nextProps){
    this.loadAnnouncements(nextProps.location.pathname);
  }

  componentDidMount() {
    this.loadAnnouncements(this.props.location.pathname);
  }

  loadAnnouncements = (url) => {
    axios.get(`${"/api"}${url}`).then(res => {
      this.setState(
        { _class: res.data, announcements: res.data.announcements },
        this.mapAnnouncements
      );
    });
  }

  renderTeacherActions = () => {
    let _class = this.state._class;
    if (_class) {
      if (_class.teacher === this.props.user._id) {
        return (
          <React.Fragment>
            <Link

              className="post-content btn-small"
              to={"/ComposeClassAnnouncement/" + _class._id}
            >
              New Post
            </Link>
          </React.Fragment>
        );
      }
    }
  };

  renderContent = announcement =>{
    let content = marked(announcement);
    return {__html: content};
  }

  mapAnnouncements = () => {
    let ann = this.state.announcements;
    let annHTML = ann.map(item => {
      let date = new Date(item.date);
      let dateFormatted = date.toLocaleString('en-US', {timeZone: "America/New_York"});
      return (
        <div key={item.date} className="item-container">
          <li className="item">
            <h3 className="announcement-header">{item.header}</h3>
            <div>
              <div dangerouslySetInnerHTML={this.renderContent(item.preview)} className="announcement-body">
              </div>
            </div>
            <p>
              <span>Posted on: {dateFormatted}</span>
            </p>
          </li>
        </div>
      );
    });
    this.setState({announcementsHTML: annHTML});
  };
  render() {
    return (
      <div id="content-section-container" className="container">
        <div className="row" id="content-area-row">
          <div className="col s2 m2 l2 xl2">
            <Fixedmenu />
          </div>

          <div id="class-content-wrapper" className="col s8 m8 l8 xl8">

              <div id="class-content-section" className="col s12 m3 l12 xl12 ">
                <div className="class-content-section-container">
                  <div className="content-header">
                    <h2>Announcements</h2>
                  </div>
                  <ul>
                    {this.state.announcementsHTML}
                  </ul>
                </div>
              </div>

          </div>

          <div className="col s2">{this.renderTeacherActions()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.user };
};

export default withRouter(connect(mapStateToProps)(Announcements));
