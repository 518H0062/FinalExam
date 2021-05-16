import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import * as actions from "../../actions";
import axios from 'axios';
import uuid from 'uuid';
import { iconType } from '../ClassMenuComponents/iconTypes';

class SidenavStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    for(let i = 0; i < this.props.classes.length; i++){
      if(this.props.classes[i].studentList.length < nextProps.classes[i].studentList.length){
        this.initComponent();
      }
    }
  }

  initComponent(){
    this.loadTeachers();
    this.loadStudents();
  }

  loadTeachers = () => {
    let my_teacher = [];
    axios.get("/api/teachers-only-list").then(res => {
      for(let i = 0; i < this.props.user.classes.length; i++ ){
        for(let j = 0; j < res.data.length; j++){
          if(this.props.user.classes[i].teacher == res.data[j]._id
          && my_teacher.indexOf(res.data[j]) < 0){
            my_teacher.push(res.data[j]);
          }
        }
      }
      this.setState({teachers: my_teacher}, this.mapTeachers);
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

  checkVerified = (class_id) => {
    let _class = this.props.user.user_class_ids.find(_class => {
      return _class.class_id === class_id;
    });
    return _class.verified;
  }

  mapStudentListBuffer = (_class, students) => {
    let studentList = this.state.studentListBuffer;
    let verified = this.checkVerified(_class._id);
    
    if(students.length !== 0) {
    let temp_studentList = (
    <React.Fragment>
      <li className={`${"waves-effect sidenav_subheader "} + ${verified?"":"unverified"}`} onClick={() => this.dropDown((_class._id + "class_students"))}>
        <a className="subheader">
          <i className="material-icons">{verified?iconType(_class.type):"close"}</i>
          {_class.type + _class.level} 
          <span>:{_class.section}</span>
          {verified?<i className="right-icon material-icons">arrow_drop_down</i>:""}
        </a>
      </li>
      <div id={_class._id + "class_students"} className="hidden">
        {verified?
          students.map(student => {
          if(student._id !== this.props.user.id){
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
          );}
        }):""}
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
        {/* <li className="waves-effect sidenav_subheader" onClick={() => this.dropDown("sidenav_teacher_list")}>
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
        </li> */}
        {/* <li className="waves-effect sidenav_subheader" onClick={() => this.dropDown("sidenav_student_list")}>
          <a className="subheader">
            <i className="material-icons">school</i>
            CLASSMATES
            <i className="right-icon material-icons">arrow_drop_down</i>
          </a>
        </li>
        <div id="sidenav_student_list" className="hidden">
          {this.state.studentList}
        </div>
        <li>
          <div className="divider" />
        </li> */}
      </React.Fragment>
    );
  }
}
export default SidenavStudent;
