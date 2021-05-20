import React, { Component } from "react";
import { connect } from "react-redux";
import Fixedmenu from "../Fixedmenu";
import axios from "axios";
import Loading from '../Loading';
import * as M from 'materialize-css';
import * as actions from '../../actions';

class VerifyStudents extends Component {
  constructor(props) {
    super(props);
    this.state = {
        _class: null,
        studentData: [],
        studentList: <Loading />
    }
  }

  componentWillMount() {
    this.loadClassData();
  }

  loadClassData = () => {
    let class_id = this.props.location.pathname.slice(16);
    axios.get(`${"/api/class"}/${class_id}`).then(res => {
        this.setState({_class: res.data}, this.loadStudentsData);
    });
  };

  loadStudentsData = () => {
    let promise_array = this.state._class.unverifiedStudents.map(student_id =>{
        var promise = axios.get(`${"/api/user"}/${student_id}`).then(res => {
          console.log(res.data);

            return res.data;
        });
        return promise;
    });
    Promise.all(promise_array).then(data => this.setState({studentData: data}, this.mapStudents));
  }

  mapStudents = () => {
    let list = this.state.studentData.map(student=>{
        return (
            <li className="student-list-li" key={student._id}>

                    <img className="circle"src={student.avatar} width="50px" height="50px" />
                    <p><p>{student.displayName}</p><p>EMPLID: {student.EMPLID}</p></p>
                    <a target={student._id} onClick={this.verifyStudent} className="btn-small">verify</a>

            </li>
        );
    });
    this.setState({studentList: list});
  }

  verifyStudent = e => {
      e.preventDefault();
      console.log(e.target.target);
      let data = {class_id: this.state._class._id, user_id: e.target.target}
      axios.put("/api/verify_user_of_class", data).then(res=>{
        M.toast({html: res.data.message});
        this.loadClassData();
        this.props.fetchClasses(this.props.user._id);
      });
  }

  render() {
    return (
      <div id="content-section-container" className="container">
        <div className="row" id="content-area-row">

          <div className="col s12 m2 l2 xl2">
            <Fixedmenu />
          </div>
          <div id="student-list"className="col s18 m8 l8 xl8">
            <div className="reusable-header">
              <h4 className="">Verify Students</h4>
            </div>
            <ul className="student-list-ul">
                {this.state.studentList}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.user };
};

export default connect(mapStateToProps, actions)(VerifyStudents);
