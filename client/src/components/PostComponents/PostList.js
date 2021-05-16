import React, { Component } from "react";
import Post from "./Posts";

export class PostList extends Component {
  render() {
    let postNodes = this.props.data.map(post => {
      return (
        <Post
          author={post.author}
          admin={post.admin}
          uniqueID={post["_id"]}
          key={post.id}
          onPostDelete={this.props.onPostDelete}
          onPostEdit={this.props.onPostEdit}
        >
          {post.text}
        </Post>
      );
    });
    return <div className="row">{postNodes}</div>;
  }
}
export default PostList;
