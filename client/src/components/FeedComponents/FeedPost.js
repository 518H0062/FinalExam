import React, { Component } from 'react';
import {Link, withRouter,Redirect } from 'react-router-dom';
import uuid from 'uuid';
import axios from 'axios';
import marked from 'marked';
import * as M from 'materialize-css';
class FeedPost extends Component {
  constructor(props){
    super(props);

    this.state = {
      feedURL: "/api/feed",
      feedItemURL: "/feed",
      author: "",
      title: "",
      postDate:"",
      content: "",
      comments: "",
      new_comment: "",
      updatePostURL: "/newNews"
   };
  }

  showCommentSection = (e) => {
    e.preventDefault();
    this.loadComments();
    console.log(e.target);
    let element;
    if(e.target.target){
      element = document.getElementById(e.target.target);
    }else{
      element = document.getElementById(e.target.parentNode.target);
    }

    if(!element.classList.contains('show')){
      element.classList.add("show");
    }else{
      element.classList.remove("show");
    }
  }
  
  loadComments = () => {
    axios.get(`${"/api/get-comments/"}/${this.props.feed_id}/${0}`).then(res => {
      this.mapComments(res.data);
    });
  }

  onCommentChange = e => {
    this.setState({ new_comment: e.target.value });
  };

  submitNewComment = e => {
    e.preventDefault();
    let date = new Date();
    let comment = {
      user_name: this.props.user.displayName,
      user_avatar: this.props.user.avatar,
      content: this.state.new_comment,
      postDate: date.toLocaleString(),
      key: uuid()
    };
    axios.post(`${"/api/new-comment"}/${this.props.feed_id}`, comment).then(res => {
      M.toast({ html: res.data.message });
      this.loadComments();
      this.setState({new_comment: ""});
    });
  };

  mapComments = comments => {
    let mappedComments = comments.map(cmt => {
      return (
        <li className="z-depth-1" key={cmt.key}>
            <img src={cmt.user_avatar} />
          <div className="card horizontal">
            <div className="card-stacked">
              <div className="card-content">
                <h6>{cmt.user_name}:</h6>
                <p>{cmt.content}</p>
                <p className="comment-post-date">Đăng vào ngày: {cmt.postDate}</p>
              </div>
            </div>
          </div>
        </li>
      );
    });
    this.setState({ comments: mappedComments });
  }

  renderContent = () =>{
    let content = marked(this.props.content);
    return {__html: content};
  }

  delFeed = (e)=>{
    e.preventDefault();
    let feedId =e.target.parentNode.target;
    if (window.confirm("Bạn có muốn xóa bài viết này")) {
      axios.delete(`${"/api/feed/"}/${feedId}`).then(res => {
        console.log(res.data);
      }).then(window.location.reload());
    }
  }

  render() {
    return (
        <div className={`${"feed-post hoverable "}${this.props.type}`}>
          <h3><Link to={`${this.state.feedItemURL}/${this.props.feed_id}`} >{this.props.title}</Link></h3>
          
          <div className="comment-button-update-delete">
          <Link className="read-more-link" to={`${this.state.updatePostURL}/${this.props.feed_id}`}>
          <i class="fas fa-edit"></i>
          <span>Sửa</span>
          </Link>
   
                  <a href="" target={this.props.feed_id} onClick={this.delFeed} className="read-more-link">
                  <i class="fas fa-trash-alt"></i>
                    <span>Xóa</span>
                  </a>
                  </div>
                  
            <div className="divider"></div>
            <div className="feed-item-body">
              <div className="inputed-post" dangerouslySetInnerHTML={this.renderContent()}>

              </div>
            </div>
              <Link className="read-more-link" to={`${this.state.feedItemURL}/${this.props.feed_id}`} onClick={this.giveLog}>Đọc thêm...</Link>
            <div className="feed-item-footer">
              <div className="feed-item-footer-left"><time className=" js-relative-time">{this.props.postDate}</time> bởi

                <div className="chip">
                  <img src={this.props.authorAvatar} alt="Contact Person"/>
                  {this.props.author}
                </div>


                <div className="comment-button">
                  <a href="" target={this.props.feed_id} onClick={this.showCommentSection} className="i-wrapper">
                    <i className="material-icons">comment</i>
                    <span>Bình luận</span>
                  </a>
                  
                </div>
              </div>
            </div>

            <div id={this.props.feed_id} className="comments-container">
              <div className="comments">
              <ul>
                {this.state.comments}
              </ul>
              </div>
              <div className="new-comment">
                <form onSubmit={this.submitNewComment}>
                <div className="input-comment-body">
                  {/* <img className="circle" src={this.props.user.avatar} /> */}
                  <div className="input-wrapper">
                    <input
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
              </div>
          </div>
    );
  }
}

export default FeedPost;
