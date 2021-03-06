import React, { Component } from "react";
import { connect } from "react-redux";
import FixedMenu from "./Fixedmenu";
import axios from "axios";
import * as M from "materialize-css";
import uuid from 'uuid';

const initialState = {
      edditable: false,
      renderModal: false,
      renderResumeModal: false,
      renderResearchModal: false,
      renderProjectsModal: false,
      profile: "",
      profile_classes: "",
      user_status: "",
    
 
      tooltip_avatar: "",
      
      profile_eddit_tooltip: "",
      new_picture_url: "",
      new_major: "",
      new_phone: "",
      new_address: "",
      new_aboutMe: "",
      new_interests: "",
      new_skills: "",
      new_resume: "",
      new_research_header: "",
      new_research_link: "",
      new_project_header: "",
      new_project_link: "",
      projects: false,
      research: false
}
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.location.pathname !== nextProps.location.pathname){
      this.setState(initialState, this.initComponent);
    }
  }

  componentDidMount() {
    this.initComponent();
  }

  initComponent = () => {
    this.checkUser();
    this.loadUserProfile(this.props.location.pathname);
    this.initTooltips();
  }

  edditPicture = e => {
    e.preventDefault();
  };

  checkUser = () => {
    if (this.props.user == null) {
      setTimeout(this.checkUser, 100);
    } else {
      let url_id = this.props.location.pathname.slice(9);
      if (this.props.user._id === url_id) {
        this.setState({ edditable: true,
          user_status: {admin: this.props.user.admin,
            teacher: this.props.user.teacher}});
      } else {
        this.setState({ user_status: {admin: this.props.user.admin,
            teacher: this.props.user.teacher}});
      }
    }
  };



  initTooltips = () => {
    let edit_avatar = document.getElementById("edit-user-avatar");
    let edit_profile = document.getElementById("eddit-profile-btn");
    if (edit_avatar && edit_profile) {
      let instance = M.Tooltip.init(edit_avatar, {
        html: "Edit Picture",
        position: "top"
      });
    
      let instance2 = M.Tooltip.init(edit_profile, {
        html: "Edit Profile Info",
        position: "top"
      });
      this.setState({
        tooltip_avatar: instance,
        profile_eddit_tooltip: instance2
      });
    } else {
      setTimeout(this.initTooltips, 50);
    }
  };

  loadUserProfile = url => {
    let url_id = url.slice(9);
    axios.get(`${"/api/user-profile"}/${url_id}`).then(res => {
      console.log(res.data);

      this.setState({ profile: res.data });
    });
  };



  mapProfileClasses = () => {
    let classes = this.state.profile.classes;
    console.log(classes);
    let profile_classes = <div className="current-classes-body">
    {classes.map(_class => {
      return (
        <ul className="current-class-body" key={uuid()}>
        <li className="profile_class_type">{_class.type}{_class.level}</li>
        <li className="profile_class_subject">{_class.subject}</li>
        <li className="profile_class_description">{_class.description}</li>
        </ul>
      );
    })}
    </div>;
    this.setState({profile_classes: profile_classes}, this.mapResearchAndProjects);
  }

  mapResearchAndProjects = () => {
    if(this.state.profile){
      if(this.state.profile.projects.length){
        let _projects = this.state.profile.projects.map(p => {
          return <li key={uuid()}><a href={p.project_link}>{p.project_header}</a></li>;
        });
        this.setState({projects: _projects});
      }
      if(this.state.profile.research.length){
        let _research = this.state.profile.research.map(p => {
          return <li key={uuid()}><a href={p.research_link}>{p.research_header}</a></li>;
        });
        this.setState({research: _research});
      }
    }
  }


  showPictureInput = e => {
    e.preventDefault();
    let elem = document.getElementById("edit-user-avatar-input");
    if (elem.classList.contains("scale-in")) {
      elem.classList.remove("scale-in");
    } else {
      elem.classList.add("scale-in");
    }
  };

  onPictureUrlChange = e => {
    this.setState({ new_picture_url: e.target.value });
  };
 

  uploadUpdatedPicture = e => {
    if (e.key === "Enter") {
      let new_url = this.state.new_picture_url;
      axios
        .put(`${"/api/profile-update-picture"}/${this.state.profile._id}`, {
          new_url: new_url
        })
        .then(res => {
          M.toast({ html: res.data.message });
          this.setState({ new_picture_url: "" });
          let elem = document.getElementById("edit-user-avatar-input");
            if (elem.classList.contains("scale-in")) {
              elem.classList.remove("scale-in");
            } else {
              elem.classList.add("scale-in");
            }
          this.loadUserProfile(this.props.location.pathname);
        });
    }
  };



  renderProfile = () => {
    switch (this.state.profile) {
      case null:
        return "";
      default:
        let profile = this.state.profile;
        return (
          <div className="row profile-container">
            <div className="col xs12 s12 m4 l3 xl3">
              <div className="profile-left-section z-depth-2">
                <div className="profile-avatar">
                  <img className="" src={profile.avatar} />
                  <input
                    id="edit-user-avatar-input"
                    value={this.state.new_picture_url}
                    onChange={this.onPictureUrlChange}
                    onKeyPress={this.uploadUpdatedPicture}
                    className="z-depth-1 scale-transition scale-out"
                    placeholder="Enter Url"
                  />
                  {this.state.edditable ? (
                    <a
                      id="edit-user-avatar"
                      className="btn-floating btn-small waves-effect waves-light"
                      onClick={this.showPictureInput}
                    >
                      <i className="material-icons">add</i>
                    </a>
                  ) : (
                    ""
                  )}
                </div>
                    
                <div className="divider"/>
                <div className="profile-contact-info">
                  <p>{profile.displayName}</p>
                  {this.renderUserStatus()}
                  <p>Chuy??n ng??nh: {this.state.profile.major?this.state.profile.major:"K??? Thu???t ph???n m???m"}</p>
                  <div id="profile-contact-info">
                    <h6>Th??ng tin c?? nh??n</h6>
                    <p>Email: {this.state.profile.email?this.state.profile.email:"admin@gmail.com"}</p>
                    <p>S??? ??i???n tho???i: {this.state.profile.phone?this.state.profile.phone:"0798990797"}</p>
                  </div>
                </div>
                {this.state.edditable? <a id="eddit-profile-btn" className="btn-small" onClick={this.showProfileModal}><i className="material-icons">add</i></a>:""}
              </div>
            </div>
            <div id="profile-content" className="col xs12 s12 m8 l9 xl9">
              <div className="profile-name">
                <div className="profile-name-header">
                  <h5>
                    {profile.displayName}
                    ({this.renderUserStatus()})
                  </h5>
                </div>
              </div>
              <div className="profile-right-section ">
                    <div className="bio">
                      <div className="bio-header">
                        <h6>Th??ng tin c?? nh??n</h6>
                      </div>
                      <ul className="bio-ul">
                        <li className="bio-li">
                          <h4 className="bio-li-header">About Me:</h4>
                          <p>{this.state.profile.about_me?this.state.profile.about_me: "T??i l?? Minh Th??"}</p>
                        </li>
                        <li className="bio-li">
                          <h4 className="bio-li-header">L???p:</h4>
                          <p> {this.state.profile.interests?this.state.profile.interests: "518H0062"}</p>
                        </li>
                        <li className="bio-li">
                          <h4 className="bio-li-header">Chuy??n ng??nh:</h4>
                          <p> {this.state.profile.skills?this.state.profile.skills:"K??? thu???t ph???n m???m"}</p>
                        </li>
                      </ul>
                    </div>
                <div className="resume-research-projects">

                  {/* <div className="resume z-depth-2">
                    <div className="reusable-header">
                      <h6>Resume</h6>
                    </div>
                    <div className="resume-research-projects-body">
                      <a href={this.state.profile.resume}>{profile.displayName}'s Resume</a>
                    </div>
                    {this.state.edditable?<a onClick={this.showResumeModal} className="btn-small">add</a>: ""}
                  </div> */}
                  
                  {/* <div className="research z-depth-2">
                    <div className="reusable-header">
                      <h6>Research</h6>
                    </div>
                    <div className="resume-research-projects-body">
                      <ul>
                        {this.state.research?this.state.research: "Nothing yet..."}
                      </ul>
                    </div>
                    {this.state.edditable?<a onClick={this.showResearchModal} className="btn-small">add</a>: ""}
                  </div>

                  <div className="projects z-depth-2">
                    <div className="reusable-header">
                      <h6>Projects</h6>
                    </div>
                    <div className="resume-research-projects-body">
                      <ul>
                        {this.state.projects?this.state.projects:"I have time"}
                      </ul>
                    </div> 
                    {this.state.edditable?<a onClick={this.showProjectsModal} className="btn-small">add</a>: ""}
                  </div> */}

                </div>

              </div>
              {/* <div className="current-classes z-depth-2">
                <div className="reusable-header">
                  <h6>Current Classes</h6>
                </div>
                {this.state.profile_classes}
              </div> */}
            </div>
          </div>
        );
    }
  };
  renderUserStatus = () => {
    let user = this.state.user_status;
    if (user.admin) {
      return <p>Qu???n tr??? vi??n</p>;
    } else if (user.teacher) {
      return <p>Ph??ng Khoa</p>;
    } else {
      return <p>Sinh Vi??n</p>;
    }
  };

  onMajorChange = e => {
    this.setState({new_major: e.target.value});
  }
  onPhoneChange = e => {
    this.setState({new_phone: e.target.value});
  }
  onAddressChange = e => {
    this.setState({new_address: e.target.value});
  }
  onAboutMeChange = e => {
    this.setState({new_aboutMe: e.target.value})
  }
  onInterestsChange = e => {
    this.setState({new_interests: e.target.value});
  }
  onSkillsChange = e => {
    this.setState({new_skills: e.target.value});
  }
  onResumeChange = e => {
    this.setState({new_resume: e.target.value});
  }
  onResearchChange = e => {
    this.setState({new_research_link: e.target.value});
  }
  onResearchHeaderChange = e => {
    this.setState({new_research_header: e.target.value});
  }
  onProjectChange = e => {
    this.setState({new_project_link: e.target.value});
  }
  onProjectHeaderChange = e => {
    this.setState({new_project_header: e.target.value});
  }

  showProfileModal = e => {
    e.preventDefault();
    this.setState({renderModal: true});
  }
  showResumeModal = e => {
    e.preventDefault();
    this.setState({renderResumeModal: true});
  }
  showResearchModal = e => {
    e.preventDefault();
    this.setState({renderResearchModal: true});
  }
  showProjectsModal = e => {
    e.preventDefault();
    this.setState({renderProjectsModal: true});
  }

  closeModal = () =>{
    this.setState({
      renderModal:false,
      new_major: "",
      new_phone: "",
      new_address: "",
      new_aboutMe: "",
      new_interests: "",
      new_skills: ""
    });
  }
  closeResumeModal = () =>{
    this.setState({
      renderResumeModal:false
    });
  }
  closeResearchModal = () =>{
    this.setState({
      renderResearchModal:false
    });
  }
  closeProjectsModal = () =>{
    this.setState({
      renderProjectsModal:false
    });
  }

  submitProfileInfo = () => {
    let changes = {
      major: this.state.new_major,
      phone: this.state.new_phone,
      address: this.state.new_address,
      aboutMe: this.state.new_aboutMe,
      interests: this.state.new_interests,
      skills: this.state.new_skills
    };

    axios.put(`${"/api/profile-update"}/${this.state.profile._id}`, 
      {profile_eddit: changes}).then(res => {
        this.setState({
          renderModal:false,
          new_major: "",
          new_phone: "",
          new_address: "",
          new_aboutMe: "",
          new_interests: "",
          new_skills: ""
        }, this.loadUserProfile(this.props.location.pathname));
        M.toast({html: res.data.message});
    });
  }

  submitResume = () =>{
    let changes = {resume: this.state.new_resume};
    axios.put(`${"/api/resume-update"}/${this.state.profile._id}`, 
      {profile_eddit: changes}).then(res => {
        this.setState({
          renderResumeModal:false,
          new_resume: ""
        }, this.loadUserProfile(this.props.location.pathname));
        M.toast({html: res.data.message});
    });
  }
  submitProject = () =>{
    let changes = {project_header: this.state.new_project_header, project_link: this.state.new_project_link};
    axios.put(`${"/api/project-update"}/${this.state.profile._id}`, 
      {profile_eddit: changes}).then(res => {
        this.setState({
          renderProjectsModal: false,
          new_project_header: "",
          new_project_link: ""
        }, this.loadUserProfile(this.props.location.pathname));
        M.toast({html: res.data.message});
    });
  }
  submitResearch = () =>{
    let changes = {research_header: this.state.new_research_header, research_link: this.state.new_research_link};
    axios.put(`${"/api/research-update"}/${this.state.profile._id}`, 
      {profile_eddit: changes}).then(res => {
        this.setState({
          renderResearchModal:false,
          new_research_header: "",
          new_research_link: ""
        }, this.loadUserProfile(this.props.location.pathname));
        M.toast({html: res.data.message});
    });
  }

  renderModal = () => {
    return (
      <React.Fragment>
        <div className="modal-underlay" onClick={this.closeModal} />
        <div className="modal profile-modal">
          <h4>Thay ?????i th??ng tin</h4>
          <div className="modal-content modal-profile-content">
            <div className="modal-left">
              <div className="modal-major">
                <p>Chuy??n ng??nh:</p>
                <input onChange={this.onMajorChange}></input>
              </div>
              <h6>Th??ng tin li??n l???c</h6>
              <div className="divider"/>
              <p>S??? ??i???n tho???i:</p><input value={this.state.new_phone} onChange={this.onPhoneChange} type="text" ></input>
            </div>
            <div className="modal-right">
              <div className="modal-about-me">
                <p>V??? t??i:</p>
                <textarea value={this.state.new_aboutMe} onChange={this.onAboutMeChange} placeholder="Th??ng tin b???n th??n"></textarea>
                <p>L???p:</p>
                <textarea value={this.state.new_interests} onChange={this.onInterestsChange} placeholder="L???p..."></textarea>
                <p>Chuy??n ng??nh:</p>
                <textarea value={this.state.new_skills} onChange={this.onSkillsChange} placeholder="Chuy??n ng??nh l?? g??..."></textarea>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a className="btn-small" onClick={this.submitProfileInfo}>C???p nh???t</a>
          </div>
        </div>
      </React.Fragment>
    );
  };

  // renderResumeModal = () => {
  //   return (
  //     <React.Fragment>
  //       <div className="modal-underlay" onClick={this.closeResumeModal} />
  //       <div className="modal resume-modal scale-in">
  //         <h4>Add a link to your resume</h4>
  //         <div className="modal-content">
  //           <input type="text" value={this.state.new_resume} onChange={this.onResumeChange}></input>
  //         </div>
  //         <div className="modal-footer">
  //           <a className="btn-small" onClick={this.submitResume}>submit</a>
  //         </div>
  //       </div>
  //     </React.Fragment>
  //   );
  // };
  // renderProjectsModal = () => {
  //   return (
  //     <React.Fragment>
  //       <div className="modal-underlay" onClick={this.closeProjectsModal} />
  //       <div className="modal projects-modal scale-in">
  //         <h4>Add your Project</h4>
  //         <div className="modal-content">
  //           <p>Header</p>
  //           <input id="projects-header-input" type="text" value={this.state.new_project_header} onChange={this.onProjectHeaderChange}></input>
  //           <p>Link</p>
  //           <input type="text" value={this.state.new_project_link} onChange={this.onProjectChange}></input>
  //         </div>
  //         <div className="modal-footer">
  //           <a className="btn-small" onClick={this.submitProject}>submit</a>
  //         </div>
  //       </div>
  //     </React.Fragment>
  //   );
  // };

  // renderResearchModal = () => {
  //   return (
  //     <React.Fragment>
  //       <div className="modal-underlay" onClick={this.closeResearchModal} />
  //       <div className="modal projects-modal scale-in">
  //         <h4>Add your Research</h4>
  //         <div className="modal-content">
  //           <p>Header</p>
  //           <input id="projects-header-input" type="text" value={this.state.new_research_header} onChange={this.onResearchHeaderChange}></input>
  //           <p>Link</p>
  //           <input type="text" value={this.state.new_research_link} onChange={this.onResearchChange}></input>
  //         </div>
  //         <div className="modal-footer">
  //           <a className="btn-small" onClick={this.submitResearch}>submit</a>
  //         </div>
  //       </div>
  //     </React.Fragment>
  //   );
  // };


  render() {
    return (
      <div id="content-section-container" className="container">
        <div className="row" id="content-area-row">
          <div className="col m2 l2 xl2 hide-on-med-and-down">
            <FixedMenu />
          </div>
          <div className="col s12 m10 l10 xl10">{this.renderProfile()}</div>
        </div>
        {this.state.renderModal ? this.renderModal() : ""}
        {this.state.renderResumeModal ? this.renderResumeModal() : ""}
        {this.state.renderResearchModal ? this.renderResearchModal() : ""}
        {this.state.renderProjectsModal ? this.renderProjectsModal() : ""}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { user: state.user };
};

export default connect(mapStateToProps)(Profile);
