import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import Fixedmenu from "../Fixedmenu";
import Newsfeed from "../FeedComponents/Newsfeed";
import AlertSection from "../AlertSection";

class ClassContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _class: false,
      content: "",
      contentHTML: false,
      currentURL: ""
    };
  }

  renderTeacherActions = () => {
    let _class = this.state._class;
    if (_class) {
      if (_class.teacher === this.props.user._id) {
        return (
          <React.Fragment>
            <Link
              className="post-content btn-small"
              to={"/ComposeClassContent/" + _class._id}
            >
              New Post
            </Link>
          </React.Fragment>
        );
      }
    }
  };

  componentWillReceiveProps(nextProps){
    this.loadContent(nextProps.location.pathname);
  }

  componentDidMount() {
    this.loadContent(this.props.location.pathname);
  }

  loadContent = (url) =>{
    axios.get(`${"/api"}${url}`).then(res => {
      this.setState({ _class: res.data, content: res.data.content, currentURL: this.props.location.pathname }, this.mapContent);
    });
  }

  mapContent = () => {
    let content = this.state.content;
    let _content = content.map(item => {
      return (
        <div key={item.date} className="item-container">
          <i className="material-icons">assignment</i>
          <li className="item">
            <Link to={`${"/ContentItem"}/${this.state._class._id}/${item.date}`}>{item.header}</Link>
          </li>
        </div>
      );
    });
    this.setState({contentHTML: _content});
  };

  render() {
    return (
      <div id="content-section-container" className="container">
        <div className="row" id="content-area-row">
          <div className="col s12 m2 l2 xl2"><Fixedmenu /></div>
          <div id="class-content-wrapper" className="col s12 m6 l8 xl8">

              <div id="class-content-section" className="col s12 m3 l12 xl12">
                <div className="class-content-section-container">
                  <div className="content-header">
                    <h2>Content</h2>
                  </div>
                  <ul>
                    {this.state.contentHTML?this.state.contentHTML: ""}
                  </ul>
                </div>
              </div>

          </div>
          <div id="post-content" className="col s2">{this.renderTeacherActions()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.user };
};

export default withRouter(connect(mapStateToProps)(ClassContent));
