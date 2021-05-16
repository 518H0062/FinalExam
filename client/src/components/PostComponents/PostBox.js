import React, { Component } from "react";
import PostList from "./PostList";
import PostForm from "./PostForm";
import axios from "axios";

export class PostBox extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], edit: false, text: "", post_id: "" };

    this.postSubmit = this.postSubmit.bind(this);
    this.postEdit = this.postEdit.bind(this);
    this.postDelete = this.postDelete.bind(this);
    this.onPostEdit = this.onPostEdit.bind(this);
    this.editFlag = this.editFlag.bind(this);
    this.loadPostsFromServer = this.loadPostsFromServer.bind(this);
    this.pollInterval = null;
  }

  postSubmit(post) {
    let posts = this.state.data;
    post.id = Date.now();
    let newPosts = posts.concat([post]);
    this.setState({ data: newPosts });
    axios.post(this.props.url, post).catch(err => {
      console.error(err);
      this.setState({ data: posts });
    });
    console.log(post.id);
    
  }

  postEdit(post) {
    console.log(`${this.props.url}/${this.state.post_id}`);
    
    axios
      .put(`${this.props.url}/${this.state.post_id}`, { text: post.text })
      .catch(err => {
        console.log(err);
      });
  }

  postDelete(post_id) {
    axios
      .delete(`${this.props.url}/${post_id}`)
      .then(res => {
        console.log("Comment deleted");
        var d = new Date();
        console.log(d);
        
      })
      .catch(err => {
        console.error(err);
      });
    this.setState({ post_id: "" });
  }

  onPostEdit(post) {
    this.setState({ edit: true, text: post.text, post_id: post.post_id });
  }

  editFlag() {
    this.setState({ edit: false });
  }

  loadPostsFromServer() {
    axios.get(this.props.url).then(res => {
      this.setState({ data: res.data });
    });
  }

  componentWillMount() {
    this.loadPostsFromServer();
  }

  componentDidMount() {
    if (!this.pollInterval)
      this.pollInterval = setInterval(
        this.loadPostsFromServer,
        this.props.pollInterval
      );
      console.log(this.props.pollInterval);
      
  }

  componentWillUnmount() {
    this.pollInterval && clearInterval(this.pollInterval);
    this.pollInterval = null;
  }

  render() {
    return (
      <div id="postBox">
        <PostList
          data={this.state.data}
          onPostDelete={this.postDelete}
          onPostEdit={this.onPostEdit}
        />
        <PostForm
          onPostSubmit={this.postSubmit}
          onPostEdit={this.postEdit}
          editPost={{ edit: this.state.edit, text: this.state.text }}
          editFlag={this.editFlag}
        />
      </div>
    );
  }
}

export default PostBox;
