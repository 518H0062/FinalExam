import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Sidenav from "./SidenavComponents/Sidenav";
import SearchBar from "./SearchBar";
import * as M from "materialize-css";
import logo from "../img/logo.PNG";
import * as actions from '../actions';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidenavInst: "",
      sideNavInterval: "",
      pollInterval: "",
      loggedIn: false
    };
  }

  closeSideNav = () =>{
    this.state.sidenavInst.close();
  }

  //When the component mounts, set the interval for the sidenav initialization function
  //and then set the interval id in to the state to clear it later.
  componentDidMount(){
    this.props.fetchUser();
    let sideNavInterval = setInterval(this.initSidenav, 100);
    let pollInterval = setInterval(this.pollUsers_Classes, 5000);
    this.setState({ sideNavInterval: sideNavInterval, pollInterval: pollInterval});
  }
  componentWillUnmount(){
    clearInterval(this.state.pollInterval);
    clearInterval(this.state.sideNavInterval);
  }

  pollUsers_Classes = () => {
    if(this.props.user){
      this.props.fetchClasses(this.props.user._id);
      this.props.fetchUser();
    }
    console.log("Hello");
  }

  //Initializing Javascript variables for Materialize-CSS sidenav this function is on a small interval,
  //The javascript variable need the html tags to be rendered before they can be initialized, and since
  //the sidenav requires information from the server before it is rendered, this requires a delayed function call.
  initSidenav = () => {
    let sidenavDOM = document.getElementById("slide-out");
    if (sidenavDOM != null){
      let sidenav = document.querySelector(".sidenav");
      let sidenavInst = M.Sidenav.init(sidenav, { edge: "right" });
      clearInterval(this.state.sideNavInterval);
      this.setState({ sideNavInterval: "", sidenavInst: sidenavInst });
    }
  }

  //Renders the sidenav with props that are passed down from the user database.
  renderSidenav = () => {
    switch (this.props.user) {
      case null:
        return;
      case false:
        return;
      default:
        let user = this.props.user;
        return (
            <Sidenav
              email={user.email}
              name={user.displayName}
              avatar={user.avatar}
              admin={user.admin}
              teacher={user.teacher}
              user_class_ids={user.classes}
              close={this.closeSideNav}
              id={user._id}
            />
        );
    }
  };

  //The content of the page is rendered when the information on whether or not a user logged in,
  //and when said data was successfully stored in the props from the Redux store.
  renderContent = () => {
    switch (this.props.user) {
      case null:
        return;
      case false:
        return (
          <React.Fragment>
            <li>
              <a href="/auth/google">Đăng nhập với google</a>
            </li>
            <li>
              <Link to="/login">Đăng nhập</Link>
            </li>
            
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            {/* <li>
              <a href="/posts" className="btn-floating btn-medium cyan pulse">
                <i className="material-icons">comment</i>
              </a>
            </li> */}
            <li className="header-user-btn">
              <a
                data-target="slide-out"
                className="sidenav-trigger waves-effect waves-light show-on-medium-and-down show-on-medium-and-up"
              >
                <img
                  id="header-avatar"
                  className="circle z-depth-2"
                  src={this.props.user.avatar}
                  height="50px"
                  width="50px"
                />
                <span className="hide-on-med-and-down">
                  {this.props.user.displayName}
                </span>
              </a>
            </li>
          </React.Fragment>
        );
    }
  };
  render() {
    return (

      <div id="header-div">
        <nav id="header-nav">
          <div id="nav-wrapper" className="container">
            <div id="header-row" className="row">
              <div id="header-logo" className="col m3 l3 xl3">
                <Link
                  to={this.props.user ? "/" : "/"}
                  className="brand-logo"
                >
                  <img src={logo} alt="sitelogo" />
                </Link>
              </div>
              <SearchBar />
              <div id="header-buttons" className="col m4 l5 xl5">
                <ul className="right">{this.renderContent()}</ul>
              </div>
            </div>
          </div>
        </nav>
        {this.renderSidenav()}
      </div>
    );
  }
}

//Maps the user accont info from the Redux store to the component props.
const mapStateToProps = state =>{
  return { user: state.user };
}

export default withRouter(connect(mapStateToProps, actions)(Header));
