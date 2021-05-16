import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import Quill from "quill";

export class PostForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      author: "",
      text: "",
      edit: false,
      qhtml: '',
      qtext: ''
    };
    this.onTextChange = this.onTextChange.bind(this);
    this.onPostSubmit = this.onPostSubmit.bind(this);
    this.onPostEdit = this.onPostEdit.bind(this);
  }

  onTextChange(e) {
    this.setState({ text: e.target.value });
  }

  componentWillReceiveProps() {
    if (this.props.editPost.edit) {
      this.setState({ text: this.props.editPost.text, edit: true });
      this.props.editFlag();
    }
  }

  onPostSubmit(e) {
    e.preventDefault();
    let author = this.props.user.displayName.trim();
    let text = this.state.text.trim();
    if (!text) {
      return;
    }
    this.props.onPostSubmit({ author: author, text: text });
    this.setState({ text: "" });
  }

  onPostEdit(e) {
    e.preventDefault();
    let text = this.state.text.trim();
    if (!text) {
      return;
    }
    this.props.onPostEdit({ author: this.state.author, text: text });
    this.setState({ edit: false, text: "" });
  }

  renderInput = () => {
    return (
      <div>
        <div
          className="row"
          onSubmit={this.state.edit ? this.onPostEdit : this.onPostSubmit}
        >
          <form className="col s12">
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">account_circle</i>
                <input
                  id="icon_prefix"
                  type="text"
                  className="validate"
                  value={this.state.text}
                  onChange={this.onTextChange}
                />
                <label>Leave a post</label>
                <input type="submit" value="Post" />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  componentDidMount() {
    this.renderQuill();
  }

  quillsubmit = (e) => {
    e.preventDefault();
    console.log(this.state.qtext);

  }
  qchange = (e) => {
    this.setState({qtext:e.target.value})
  }

  renderQuill = () => {
    let toolbarOptions = [
      ["bold", "italic", "underline", "strike"],
      ["blockquote"],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }]
      [{"size":['small', false, 'large', 'huge']}],
      ['link', 'image', 'video'],
      [{'color':[]}, {'background': []}]
    ];
    let quill = new Quill("#quill", {
      modules: {
        toolbar: toolbarOptions
      },
      theme: "snow"
    });
    return "";
  };
  render() {
    return (
      <React.Fragment>
        {this.renderInput()}

        <div id="quill" onChange={this.qchange} value={this.state.qtext}>
        </div>
        <button className="btn" type="submit" onClick={this.quillsubmit} value="Post">Post</button>
      </React.Fragment>
    );
  }
}

//const mapStateToProps = state => {
//  console.log(state.user);
//
//  return {
//    author: state.user
//  };
//};
function mapStateToProps(state) {
  console.log(state.auth);

  return { user: state.auth };
}

export default connect(mapStateToProps, actions)(PostForm);
