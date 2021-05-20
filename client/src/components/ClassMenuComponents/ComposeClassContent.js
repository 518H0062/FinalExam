import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import { withRouter } from "react-router-dom";
import FixedMenu from "../Fixedmenu";
import Quill from "quill";
import * as M from 'materialize-css';

class ComposeClassContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quill: "",
      quillDelta: null,
      deltaMarkup: null,
      header: "",
      redirectURL: "/"
    };
  }

  renderFixedMenu = () => {
    switch (this.props.user) {
      case null:
        return "";
      case false:
        return "";
      default:
        return <FixedMenu user={this.props.user} />;
    }
  };

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
    //Grabs the delta from the quill state object
    let delta = this.state.quill.getContents();
    //Grabs the HTML from whithin the Quill edditor
    let quill_innerHTML = document.getElementsByClassName("ql-editor")[0]
      .innerHTML;
    //Sets the states and calls upload event after
    this.setState(
      { deltaMarkup: quill_innerHTML, quillDelta: delta },
      this.uploadPost
    );
  };

  uploadPost = () => {
    let post = {
      author: this.props.user.displayName,
      avatar: this.props.user.avatar,
      header: this.state.header,
      delta: this.state.quillDelta,
      preview: this.state.deltaMarkup,
      date: Date.now()
    };

    axios.put(`${"/api"}${this.props.location.pathname}`, post).then(res => {
        M.toast({html: res.data.message});
        this.setState({redirectURL: ("/ClassContent/" + res.data.id)}, this.redirectBack)
    });
  };

  redirectBack = () => {
      this.props.history.push(this.state.redirectURL)
  }

  logtest = () => {
    let user1 = "5acea765be510d39f0244899";
    let user2 = "5ad0e42892074431f48da49b";
    let index = 0;
    let roomId = "";
    if(user1.length < user2.length){
      index = user1.length;}
      else{
        index = user2.length;}
    for(var i = 0; i < index; i++){
      let temp1 = user1.slice(i,i+1);
      //console.log(temp1);
      let temp2 = user2.slice(i, i+1);
      let tempRoomIdPart = String(parseInt(temp1, 16)+parseInt(temp2, 16));
      roomId += tempRoomIdPart;
    }
    console.log(roomId);

    //console.log(parseInt("A",16));

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

    ///////////////////////////////////////
    <div id="event-section-container" className="container">
        <div className="row" id="content-area-row">
            <div className="col s2">{this.renderFixedMenu()}</div>
            <div id="event-editor-area" className="col s12 m7 l7 xl7">
              <div className="event-editor-area-wrapper">
                <div className="post-event-header">
                  <h4>Submit content</h4>
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
                    {/* <button className="btn" onClick={this.logtest}>LOOOOOOOG</button>
                    */}
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

export default withRouter(connect(mapStateToProps)(ComposeClassContent));
