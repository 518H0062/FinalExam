import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import * as actions from "../../actions";
import axios from 'axios';
import uuid from 'uuid';
import { iconType } from '../ClassMenuComponents/iconTypes';

class SidenavAdminTeacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminList: "",
      teacherList: "",
      studentList: "",
      studentListBuffer: [],
      teachers: null
    };
  }

  componentDidMount() {
    this.initComponent();
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.classes.length > this.props.classes.length){
      this.initComponent();
    } else{
      for(let i = 0; i < nextProps.classes.length; i++){
        if(this.props.classes[i].studentList.length < nextProps.classes[i].studentList.length){
          this.initComponent();
        }
      }
    } 
  }

  initComponent(){
    this.mapAdmins();
    this.loadTeachers();
    this.loadStudents();
  }

  loadTeachers = () => {
    axios.get("/api/teachers-only-list").then(res => {
      this.setState({teachers: res.data}, this.mapTeachers);
    });
  }

  loadStudents = () => {
    this.setState({studentList: "", studentListBuffer: []}, () => {
      for(let i = 0; i < this.props.user.classes.length; i++){
        axios.get(`${"/api/student-list"}/${this.props.user.classes[i]._id}`).then(res =>{
        this.mapStudentListBuffer(this.props.user.classes[i],res.data); 
        });
      }
    });
  }

  mapAdmins = () => {
    if (this.props.admins !== null) {
      let admins = this.props.admins;
      let adminList = admins.map(admin => {
        if(admin._id !== this.props.user.id){
          return (
            <li key={admin._id + "admin"}>
              <div className="sidenav_username waves-effect" to={`${"/chat"}/${admin._id}`}>
                <img
                  src={admin.avatar}
                  alt="user avatar"
                  className="sidenav_avatars"
                />
                <span>{admin.displayName}</span>
                {/* <Link onClick={this.props.close} to={`${"/chat"}/${admin._id}`}><i className="material-icons">chat</i></Link> */}
                <Link onClick={this.props.close} to={`${"/profile"}/${admin._id}`}><i className="fas fa-user"></i></Link>
              </div>
            </li>
          );
      }});
      this.setState({ adminList: adminList });
    }
  };

  mapTeachers = () => {
    if (this.state.teachers !== null) {
      let teachers = this.state.teachers;
      let teacherList = teachers.map(teacher => {
        return (
          <li key={teacher._id + "teacher"}>
            <div className="sidenav_username waves-effect" to={`${"/chat"}/${teacher._id}`}>
              <img
                src={teacher.avatar}
                alt="user avatar"
                className="sidenav_avatars"
              />
              <span>{teacher.displayName}</span>
              {/* <Link onClick={this.props.close} to={`${"/chat"}/${teacher._id}`}><i className="material-icons">chat</i></Link> */}
                <Link onClick={this.props.close} to={`${"/profile"}/${teacher._id}`}><i className="fas fa-user"></i></Link>
            </div>
          </li>
        );
      });
      this.setState({ teacherList: teacherList });
    }
  };

  mapStudentListBuffer = (_class, students) => {
    let studentList = this.state.studentListBuffer;
    if(students.length !== 0) {
    let temp_studentList = (
    <React.Fragment>
      <li className="waves-effect sidenav_subheader" onClick={() => this.dropDown((_class._id + "class_students"))}>
        <a className="subheader">
          <i className="material-icons">{iconType(_class.type)}</i>
          {_class.type + _class.level} 
          <span>:{_class.section}</span>
          <i className="right-icon material-icons">arrow_drop_down</i>
        </a>
      </li>
      <div id={_class._id + "class_students"} className="hidden">
        {students.map(student => {
          return (
            <li key={student._id + "student"}>
              <div className="sidenav_username waves-effect" to={`${"/chat"}/${student._id}`}>
                <img
                  src={student.avatar}
                  alt="user avatar"
                  className="sidenav_avatars"
                />
                <span>{student.displayName}</span>
                {/* <Link onClick={this.props.close} to={`${"/chat"}/${student._id}`}><i className="material-icons">chat</i></Link> */}
                <Link onClick={this.props.close} to={`${"/profile"}/${student._id}`}><i className="fas fa-user"></i></Link>
              </div>
            </li>
          );
        })}
      </div>
    </React.Fragment>
    );
    studentList.push(temp_studentList);
    this.setState({ studentListBuffer: studentList }, this.mapStudentList);
  }
  };
  mapStudentList = () => {
    if(this.state.studentListBuffer){
      let buffer = this.state.studentListBuffer;
      let studentList = buffer.map(students => {
        return <div key={uuid()}>
                {students}
              </div>;
      });
      this.setState({studentList: studentList});
    }
  }

  dropDown = id => {
    let elem = document.getElementById(id);
    if (elem.classList.contains("hidden")) elem.classList.remove("hidden");
    else elem.classList.add("hidden");
  };

  render() {
    return (
      <React.Fragment>
        {/* <li className="waves-effect sidenav_subheader" onClick={() => this.dropDown("sidenav_admin_list")}>
          <a className="subheader">
            <i className="material-icons">face</i>
            ADMINS
            <i className="right-icon material-icons">arrow_drop_down</i>
          </a>
        </li>
        <div id="sidenav_admin_list">
          {this.state.adminList}
        </div> */}
        <li>
          <div className="divider" />
        </li>
        <li className="waves-effect sidenav_subheader" onClick={() => this.dropDown("sidenav_teacher_list")}>
          <a className="subheader">
            <i className="material-icons">school</i>
            PHÒNG KHOA
            <i className="right-icon material-icons">arrow_drop_down</i>
          </a>
        </li>
        <div id="sidenav_teacher_list" className="hidden">
          {this.state.teacherList}
        </div>
        <li>
          <div className="divider" />
        </li>
        <li className="waves-effect sidenav_subheader" onClick={() => this.dropDown("sidenav_student_list")}>
          <a className="subheader">
            <i className="material-icons">school</i>
            SINH VIÊN
            <i className="right-icon material-icons">arrow_drop_down</i>
          </a>
        </li>
        <div id="sidenav_student_list" className="hidden">
          {this.state.studentList}
        </div>
        <li>
          <div className="divider" />
        </li>
      </React.Fragment>
    );
  }
}
export default SidenavAdminTeacher;
