import React, { Component } from "react";
import { connect } from "react-redux";
import Student from "./SidenavStudent";
import Teacher from "./SidenavTeacher";
import Admin from "./SidenavAdmin";
import AdminTeacher from "./SidenavAdminTeacher";
import * as actions from "../../actions";
import * as M from "materialize-css";
import { Link } from "react-router-dom";

class Sidenav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltips: null
    }
  }

  componentDidMount() {
    this.initToolTips();
  }

  initToolTips = () => {
    let elem = document.getElementById("profile-link");
    let instance = M.Tooltip.init(elem, {position: "right", html: "Go to profile page", outDuration: 100});
    this.setState({tooltips: instance});
  }

  componentWillMount() {
    this.props.fetchClasses(this.props.id);
    this.props.fetchTeachers();
    this.props.fetchAdmins();
  }

  renderContent = () => {
    if (this.props.admins && this.props.teachers && this.props.classes) {
      let user = this.props;
      if (user.admin && user.teacher && user.classes) {
        return (
          <AdminTeacher
            user={this.props}
            admins={this.props.admins}
            teachers={this.props.teachers}
            close={this.props.close}
            classes={this.props.classes}
          />
        );
      } else if (user.admin) {
        return (
          <Admin
            user={this.props}
            admins={this.props.admins}
            teachers={this.props.teachers}
            close={this.props.close}
          />
        );
      } else if (user.teacher) {
        return (
          <Teacher
            user={this.props}
            admins={this.props.admins}
            close={this.props.close}
            classes={this.props.classes}
          />
        );
      } else
        return <Student user={this.props} teachers={this.props.teachers} classes={this.props.classes} close={this.props.close} />;
    }
  };

  render() {
    let user = this.props;
    return (
      <ul id="slide-out" className="sidenav">
        <li>
          <div className="user-view">
            <div className="background" id="sidenav-background" />
            <a>
              <img className="circle" src={user.avatar} alt="user avatar" />
            </a>
            <a>
              <span className="black-text name">{user.name}</span>
            </a>
            <a>
              <span className="white-text email">{user.email}</span>
            </a>
            <Link to={`${"/profile"}/${user.id}`} onClick={this.props.close}><i id="profile-link" className="fas fa-user"></i></Link>
          </div>
        </li>
        {this.renderContent()}
        <li className="waves-effect sidenav_subheader log_out">
          <a href= {"/changePassword/"+user.id}>Đổi mật khẩu</a>
          <a href="/api/logout">Đăng xuất</a>
        </li>
      </ul>
    );
  }
}

const mapStateToProps = state => {
  return {
    classes: state.classes,
    teachers: state.teachers,
    admins: state.admins
  };
};

export default connect(mapStateToProps, actions)(Sidenav);
