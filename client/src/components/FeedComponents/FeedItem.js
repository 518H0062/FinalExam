import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AlertSection from "../AlertSection";
import FeedPost from "./FeedPost";
import FixedMenu from "../Fixedmenu";
import Loading from "../Loading";
import axios from "axios";
import Quill from "quill";
import * as M from "materialize-css";
import uuid from "uuid";

class FeedItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedItem: false,
      quill: "",
      total_comments: 0,
      all_comments_data: [],
      incoming_comments: [],
      all_comments: [],
      new_comment: "",
      skip: 0,
      loadMore: false,
      profile: null,
      facebook: "",
      twitter: "",
      instagram: "",
      linkedIn: "",
      gitHub: ""
    };
  }

  renderContent = () => {
    return (
      <div id="feed-item-header">
        <h4>{this.state.feedItem.feedItem.title}</h4>
      </div>
    );
  };

  initQuill = () => {
    if (this.state.feedItem == null) {
    } else {
      let post = this.state.feedItem.feedItem;
      let quillInit = new Quill("#quill", {
        modules: {
          toolbar: false
        },
        readOnly: true,
        theme: "snow"
      });
      quillInit.setContents(post.delta);
      this.setState({ quill: quillInit });
    }
  };

  componentDidMount() {
    this.loadComments();
    this.getCommentAmmout();
    axios.get(`${"/api"}${this.props.location.pathname}`).then(res => {
      console.log(res.data);
      
      this.setState({ feedItem: res.data }, this.initQuill);
    });
    this.loadProfile();
  }

  loadProfile = () => {
    if(this.state.feedItem){
      axios.get(`${"/api/user-profile"}/${this.state.feedItem.feedItem.user_id}`).then(res => {
      this.setState({profile: res.data});
    });
    } else{
      setTimeout(this.loadProfile, 100);
    }
  }


  

  getCommentAmmout = () => {
    let feed_id = this.props.location.pathname.slice(6);
    axios.get(`${"/api/get-comment-number"}/${feed_id}`).then( res => {
      this.setState({total_comments: res.data.total_comments});
    });
  }

  deleteFromFeed = e => {
    e.preventDefault();
    axios.delete(`${"/api"}${this.props.location.pathname}`).then(res => {
      M.toast({ html: res.data.message });
      this.props.history.push("/");
    });
  };

  renderUser = () => {
    switch (this.state.profile) {
      case null:
        return "";

      default:
        return (
          <div className="user-col col l3 xl3">
              <div className="profile-left-section z-depth-2">
                <div className="profile-avatar">
                  <img className="" src={this.state.profile.avatar} />
                </div>
                <div className="divider"/>
                <div className="profile-contact-info">
                  <p>{this.state.profile.displayName}</p>
                  <p>Đăng vào ngày: {this.state.feedItem.feedItem.postDate}</p>
                  <div id="profile-contact-info">
                    <h6>Thông tin liên lạc</h6>
                    <p>Email: {this.state.profile.email}</p>
                    <p>Số điện thoại: {this.state.profile.phone?this.state.profile.phone:"079 8990 0797"}</p>
                  </div>
                </div>
              </div>
          </div>
        );
    }
  };

  loadMoreComments = e => {
    e.preventDefault();
    let skip = this.state.skip + 5;
    this.setState({ skip: skip, loadMore: true }, this.loadComments);
  };

  loadComments = () => {
    let feed_id = this.props.location.pathname.slice(6);
    axios
      .get(`${"/api/get-comments"}/${feed_id}/${this.state.skip}`)
      .then(res => {
          if (res.data.length > 0) {
          this.setState({incoming_comments: res.data}, this.filterRawComments);
        } else if(this.state.loadMore) {
          let skip = this.state.skip - 5;
          this.setState({ skip: skip, loadMore: false });
        }
      });
  };

  filterRawComments = () => {
    let all = this.state.all_comments_data;
    let incoming = this.state.incoming_comments;
    let dupe = 0;
    for(var i = 0; i < incoming.length; i++){
      for(var j = 0; j < all.length; j++){
        if(all[j].key === incoming[i].key){
          dupe = 1;
        }
      }
      if(!dupe){
        all.push(incoming[i]);
      } else{
        dupe = 0;
      }
    }
    if(all.length === 0){
      all = incoming;
    }
    this.setState({all_comments_data: all, incoming_comments: []}, this.mapComments)
  }

  mapComments = () => {
    let all_comments = this.state.all_comments_data.map(cmt => {
      return (
        <li className="z-depth-1" key={cmt.key}>
          <img src={cmt.user_avatar} />
          <div className="card horizontal">
            <div className="card-stacked">
              <div className="card-content">
                <h6>{cmt.user_name}:</h6>
                <p>{cmt.content}</p>
                <p className="comment-post-date">Bình luận vào ngày: {cmt.postDate}</p>
              </div>
            </div>
          </div>
        </li>
      );
    });
    this.setState({all_comments:all_comments});
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  renderComments = () => {
    switch (this.state.all_comments) {
      case false:
        return "";
      default:
        return (
          <ul id="all-comment-list" className="hidden">
            {this.state.all_comments}
            {this.state.total_comments > this.state.skip + 5?<a href="#" onClick={this.loadMoreComments}>
              Load more..
            </a>:""}
          </ul>
        );
    }
  };

  renderNewCommentForm = () => {
    switch (this.props.user) {
      case null:
        return "";
      default:
        return (
          <div className="new-comment">
            <form
              className="input-comment-form"
              onSubmit={this.submitNewComment}
            >
              <div className="input-comment-body">
                <img className="circle" src={this.props.user.avatar} />
                <div className="input-wrapper">
                  <input
                    required
                    onChange={this.onCommentChange}
                    value={this.state.new_comment}
                    placeholder="Viết bình luận"
                  />
                </div>

                <button className="btn-small">
                  <i className="material-icons">send</i>
                </button>
              </div>
            </form>
          </div>
        );
    }
  };

  onCommentChange = e => {
    this.setState({ new_comment: e.target.value });
  };

  submitNewComment = e => {
    e.preventDefault();
    if(this.state.new_comment !==""){
      let feed_id = this.props.location.pathname.slice(6);
      let date = new Date();
      let comment = {
        user_name: this.props.user.displayName,
        user_avatar: this.props.user.avatar,
        content: this.state.new_comment,
        postDate: date.toLocaleString(),
        key: uuid()
      };
      axios.post(`${"/api/new-comment"}/${feed_id}`, comment).then(res => {
        M.toast({ html: res.data.message });
        this.loadComments();
        this.getCommentAmmout();
        this.setState({ new_comment: "" });
      });
  }
  };

  showComments = e => {
    e.preventDefault();
    let comment_list = document.getElementById("all-comment-list");
    let show_hide = document.getElementById("show-hide-btn");
    if(comment_list.classList.contains("hidden")){
      comment_list.classList.remove("hidden");
      show_hide.innerHTML = "Hide";
    } else {
      comment_list.classList.add("hidden");
      show_hide.innerHTML = "Xem tất cả";
      setTimeout(this.scrollToBottom, 260);
    }
  }

  render() {
    return (
      <div id="content-section-container" className="container">
        <div className="event-editor-area-wrapper">
          <div className="row">
            <div className="col s12 m2 l2 xl2">
              <FixedMenu />
            </div>
            <div className="middle-right-section col s12 m10 l7 xl7">
              <div className="feed-item-container">
                {this.state.feedItem ? this.renderContent() : ""}
                <div className="feed-item-body">
                  <div id="quill" />
                </div>
              </div>
              <div className="comments">
                <div className="comments-header">
                  <i className="material-icons">comment</i>
                  <h6>Bình luận ({this.state.total_comments})</h6>
                  {this.state.total_comments?<a id="show-hide-btn" href="" onClick={this.showComments}>Show</a>:""}
                </div>
                {this.renderComments()}
              </div>
              <div style={{ float:"left", clear: "both" }}
                  ref={(el) => { this.messagesEnd = el; }}/>
              {this.renderNewCommentForm()}
            </div>
            {this.renderUser()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.user };
};

export default withRouter(connect(mapStateToProps)(FeedItem));
