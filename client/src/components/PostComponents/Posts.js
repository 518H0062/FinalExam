import React, { Component } from "react";
import marked from "marked";
import { connect } from "react-redux";
import * as actions from "../../actions";

export class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: false,
      teacher: false,
      author: "",
      content: "",
      toBeUpdated: false
    };
    this.deletePost = this.deletePost.bind(this);
    this.editPost = this.editPost.bind(this);
  }

  deletePost(e) {
    e.preventDefault();
    let post_id = this.props.uniqueID;
    this.props.onPostDelete(post_id);
    console.log("Deleted!");
  }

  editPost(e) {
    e.preventDefault();
    let post = { post_id: this.props.uniqueID, text: this.props.children };
    this.props.onPostEdit(post);
  }

  rawMarkup() {
    let rawMarkup = marked(this.props.children.toString());
    return { __html: rawMarkup };
  }

  render() {
    return (
      <div className="col s12 m6">
        <div className="card blue-grey darken-1 hoverable">
          <div className="card-content white-text">
            <span className="card-title">{this.props.author}</span>
            <span dangerouslySetInnerHTML={this.rawMarkup()} />
          </div>
          <div className="card-action">
            <a href="" onClick={this.deletePost}>
              DELETE
            </a>
            {
              this.props.admin
              ? <a href="" onClick={this.editPost}>EDIT</a>:""
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    admin: state.auth.admin
  };
};

export default connect(mapStateToProps, actions)(Posts);
