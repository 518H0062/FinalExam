import React, { Component } from "react";
import PostBox from "./PostBox";

export class PostIndex extends Component {
  render() {
    return <PostBox url= "/api/posts" pollInterval={2000} />;
  }
}

export default PostIndex;
