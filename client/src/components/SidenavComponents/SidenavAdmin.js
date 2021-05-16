import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as actions from "../../actions";
import axios from 'axios';
class SidenavAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminList: "",
      teacherList: "",
      teachers: null
    };
  }

  componentDidMount() {
    this.mapAdmins();
    this.loadTeachers();
  }

  loadTeachers = () => {
    axios.get("/api/teachers-only-list").then(res => {
      this.setState({teachers: res.data}, this.mapTeachers);
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
              <Link onClick={this.props.close} to={`${"/chat"}/${teacher._id}`}><i className="material-icons">chat</i></Link>
                <Link onClick={this.props.close} to={`${"/profile"}/${teacher._id}`}><i className="fas fa-user"></i></Link>
            </div>
          </li>
        );
      });
      this.setState({ teacherList: teacherList });
    }
  };
  
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
            HỌC SINH
            <i className="right-icon material-icons">arrow_drop_down</i>
          </a>
        </li>
        <div id="sidenav_admin_list" className="">
          {this.state.adminList}
        </div>
        <li>
          <div className="divider" />
        </li> */}
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    admins: state.admins
  };
};

export default withRouter(SidenavAdmin);