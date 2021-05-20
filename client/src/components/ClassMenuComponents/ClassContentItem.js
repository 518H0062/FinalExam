import React, { Component } from "react";
import Quill from "quill";
import axios from "axios";

class ClassContentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      quill: "",
      date: null
    };
  }

  componentDidMount() {
    axios.get(`${"/api"}${this.props.location.pathname}`).then(res => {
      this.setState({ content: res.data }, this.initQuill);
    });
  }


  renderUser = () => {
    switch (this.state.content) {
      case null:
        return "";
      default:
        return (
          <div className="user-col col s2 m2 l2 xl2">
            <div className="user-info">
              <div className="user-pic-wrapper">
                <img
                  className="user-pic"
                  src={this.state.content.avatar}
                  width="64"
                />
              </div>
              <p className="user-name">{this.state.content.author}</p>
              <p className="time">{this.state.date}</p>
            </div>
          </div>
        );
    }
  };

  initQuill = () => {
    if (this.state.content == null) {
    } else {
      let post = this.state.content;

      let quillInit = new Quill("#quill", {
        modules: {
          toolbar: false
        },
        readOnly: true,
        theme: "snow"
      });

      quillInit.setContents(post.delta);

      let date = new Date(this.state.content.date);
      this.setState({ quill: quillInit, date: date.toLocaleString('en-US', {timeZone: "America/New_York"}) });
    }
  };
  render() {
    return (
      <div id="content-section-container" className="container">
        <div className="event-editor-area-wrapper">
          <div className="row" id="content-area-row">
            {this.renderUser()}{" "}
            {/* Here we are calling the renderUser function*/}
            <div className="middle-right-section col s12 m12 l7 xl7">
              <div className="feed-item-container">
                {this.state.feedItem ? this.renderContent() : ""}
                <div className="feed-item-body">
                  <div id="quill" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ClassContentItem;
