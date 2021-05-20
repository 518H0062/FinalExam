import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import { withRouter } from "react-router-dom";
import FixedMenu from "../Fixedmenu";
import Quill from "quill";
import * as M from 'materialize-css';

class ComposeClassAnnouncements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quill: "",
      deltaMarkup: null,
      header: "",
      redirectURL: "/"
    };
  }

  componentDidMount() {
    //Setting up the Quill toolbar options
    let toolbarOptions = [
      ["bold", "italic", "underline", "strike"],
      ["blockquote"],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ size: [] }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }]
    ];
    //Initializing Quill state object
    let quillInit = new Quill("#quill", {
      modules: {
        toolbar: toolbarOptions
      },
      placeholder: "Compose new post",
      theme: "snow"
    });
    //Saving the Quill object in to the state
    this.setState({ quill: quillInit });
  }

  onHeaderChange = e => {
    e.preventDefault();
    this.setState({ header: e.target.value });
  };

  submitPost = () => {
    //Grabs the HTML from whithin the Quill edditor
    let quill_innerHTML = document.getElementsByClassName("ql-editor")[0]
      .innerHTML;
    //Sets the states and calls upload event after
    this.setState(
      { deltaMarkup: quill_innerHTML },
      this.uploadPost
    );
  };

  uploadPost = () => {
    let post = {
      author: this.props.user.displayName,
      avatar: this.props.user.avatar,
      header: this.state.header,
      preview: this.state.deltaMarkup,
      date: Date.now()
    };

    axios.put(`${"/api"}${this.props.location.pathname}`, post).then(res => {
        M.toast({html: res.data.message});
        this.setState({redirectURL: ("/ClassAnnouncements/" + res.data.id)}, this.redirectBack)
    });
  };

  redirectBack = () => {
      this.props.history.push(this.state.redirectURL)
  }

  renderUser = () => {
      switch (this.props.user) {
        case null:
          return "";

        default:
        return(
          <div className="user-col col s6 m6 l1 xl1">
            <div className="user-info">
              <div className="user-pic-wrapper">
                <img className="user-pic" src={this.props.user.avatar} width="64"/>
              </div>
                <p className="user-name">{this.props.user.displayName}</p>
                <p className="time">Dec 13, 2017</p>
            </div>
          </div>
        );
      }
  }

  render() {
    return (
      <div id="event-section-container" className="container">
        <div className="row" id="content-area-row">
          <div className="col s2"><FixedMenu/></div>
          <div id="event-editor-area" className="col s12 m7 l7 xl7">
            <div className="event-editor-area-wrapper">
              <div className="post-event-header">
                <h4>Compose Announcement</h4>
              </div>

              <div className="post-event-body">
                <div className="event-header-wrapper">
                  <form id="event-header">
                    <input
                      type="text"
                      value={this.state.header}
                      onChange={this.onHeaderChange}
                      placeholder="Enter Post Header"
                    />
                  </form>
                </div>
                <div id="quill-area">
                  <div id="quill" />
                  <button
                    id="saveDelta"
                    className="btn"
                    onClick={this.submitPost}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          {this.renderUser()} {/* Here we are calling the renderUser function*/}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.user };
};

export default withRouter(connect(mapStateToProps)(ComposeClassAnnouncements));
