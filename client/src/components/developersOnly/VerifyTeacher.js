import React, { Component } from "react";
import * as M from "materialize-css";
import axios from "axios";
import Fixedmenu from "../Fixedmenu";

class VerifyTeacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_list: [],
      user_options: "",
      selected: "",
      classType: "",
      init: "",
      instance: "",
      typeInstance: ""
    };
  }

  verifyTeacher = () => {
    let user = document.querySelector("select");
    axios.put(`${"/api/verify-teacher"}/${this.state.selected}/${this.state.classType}`).then( res =>{
        M.toast({html: res.data.message});
    });
  };

  selectedClassType = e =>{
    e.preventDefault();
    this.setState({classType: e.target.value})
  }

  componentDidMount() {
    this.loadUserList();
  }

  initForm = () => {
    let elem = document.getElementById("teacherName");
    let elem2 = document.getElementById("cType");
    let instance = M.FormSelect.init(elem);
    let typeInstance = M.FormSelect.init(elem2);
    this.setState({ init: elem, instance: instance, typeInstance: typeInstance });
  };

  loadUserList = () => {
    axios.get("/api/users-list").then(res => {
      this.setState({ user_list: res.data }, this.mapUserList);
    });
  };

  mapUserList = () => {
    let users = this.state.user_list;
    console.log(this.state.user_list);

    let options = users.map(user => {
      return <option key={user._id} value={user._id}>{user.displayName} EMPLID: {user.EMPLID}</option>;
    });

    this.setState({ user_options: options }, this.initForm);
  };

  selectedTeacher = e => {
    let teacher = document.getElementById("teacherName");
    this.setState({ selected: teacher.value });
  };

  render() {
    return (
      <div id="content-section-container" className="container">
        <div className="row" id="content-area-row">
          <div className="col s12 m2 l2 xl2">
            <Fixedmenu />
          </div>
          <div id="verifyteacher-container" className="col s12 m12 l3 xl3">
            <div className="row">
              <div className="reusable-header">
                <h4>Verify a Teacher</h4>
              </div>

              <div className="verifyteacher-body">
                <div id="verify-left" className="col s8 m4 l6 xl6">
                  <div className="input-field">
                    <select id="teacherName" onChange={this.selectedTeacher}>
                      <option value="">Select Teacher</option>
                      {this.state.user_options}
                    </select>
                    <label>User Selector</label>
                  </div>
                </div>
                <div className="col s8 m4 l6 xl6 input-field">
                  <select id="cType" onChange={this.selectedClassType}>
                    <option value="">Select Subject</option>
                    <option value="CSC">CSC</option>
                    <option value="ENG">ENG</option>
                    <option value="MTH">MTH</option>
                  </select>
                  <label>Class Type</label>
                </div>
                <a className="btn" onClick={this.verifyTeacher} href="#!">
                  SUBMIT
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

    );
  }
}

export default VerifyTeacher;
