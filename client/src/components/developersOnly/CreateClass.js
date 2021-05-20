import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as M from 'materialize-css';
import Fixedmenu from "../Fixedmenu";
class CreateClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      level: "",
      subject: "",
      description: ""
    };
  }
  onClassSubmit = (e) =>{
    e.preventDefault();
    let _class = {
      type: this.state.type,
      level: this.state.level,
      subject: this.state.subject,
      description: this.state.description
    }
    axios.post("/api/create-class_template", _class).then(res=>{
      if(res.data != "posted"){
        M.toast({html: res.data[0].msg});
      }
      else{
        M.toast({html: "Class Template Posted" });
        this.setState({type: "", level: "", subject: "", description: ""});
      }
    });
  }
  onTypeChange = (e) =>{
    e.preventDefault();
    this.setState({type: e.target.value});
  }
  onLevelChange = (e) =>{
    e.preventDefault();
    this.setState({level: e.target.value});
  }
  onSubjectChange = (e) =>{
    e.preventDefault();
    this.setState({subject: e.target.value});
  }
  onDescriptionChange = (e) =>{
    e.preventDefault();
    this.setState({description: e.target.value});
  }
  render() {
    return (
      <div id="content-section-container" className="container">
        <div className="row" id="content-area-row">
          <div className="col s12 m2 l2 xl2">
            <Fixedmenu />
          </div>

          <div id="class-db-input" className="col s8 m4 l7 xl7">

            <div className="reusable-header">
              <h4>Input Class to Database</h4>
            </div>

            <form className="" onSubmit={this.onClassSubmit}>
              <div className="row">
                <div className="input-field col s3">
                  <input required value={this.state.type} id="clas_type" onChange={this.onTypeChange} type="text" className="validate" />
                  <label htmlFor="calss_type">Class Type</label>
                </div>
                <div className="input-field col s3">
                  <input required value={this.state.level} id="class_level" onChange={this.onLevelChange} type="text" className="validate" />
                  <label htmlFor="class_subject">Class Level</label>
                </div>
                <div className="input-field col s6">
                  <input required value={this.state.subject} id="class_subject" onChange={this.onSubjectChange} type="text" className="validate" />
                  <label htmlFor="class_subject">Class Subject</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input required value={this.state.description} id="class_description" onChange={this.onDescriptionChange} type="text" className="validate" />
                  <label htmlFor="class_description">Class Description</label>
                </div>
              </div>
              <button type="submit" className="btn">SUBMIT</button>
            </form>

          </div>
        </div>
      </div>
      );
  }
}

var mapStateToProps = state =>{
    return { user: state.local };
}

export default connect(mapStateToProps)(CreateClass);
