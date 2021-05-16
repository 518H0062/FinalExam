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
      facebook: "",
      twitter: "",
      instagram: "",
      linkedIn: "",
      gitHub: "",
      tooltip_avatar: "",
      social_media_eddit: "",
      social_media_eddit_tooltip: "",
      profile_eddit_tooltip: "",
      new_picture_url: "",
      new_social_media_url: "",
      new_social_media_url_flag: "",
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
    this.initSocialMediaEddit();
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

  initSocialMediaEddit = () => {
    let elem = document.getElementById("edit-social-media-links");
    if (elem) {
      let instance = M.FloatingActionButton.init(elem, {
        direction: "right",
        hoverEnabled: false,
        toolbarEnabled: false
      });
      this.setState({ social_media_eddit: instance });
    } else {
      setTimeout(this.initSocialMediaEddit, 50);
    }
  };

  initTooltips = () => {
    let edit_avatar = document.getElementById("edit-user-avatar");
    let edit_soc_med = document.getElementById("social-media-eddit-button");
    let edit_profile = document.getElementById("eddit-profile-btn");
    if (edit_avatar && edit_soc_med && edit_profile) {
      let instance = M.Tooltip.init(edit_avatar, {
        html: "Edit Picture",
        position: "top"
      });
      let instance1 = M.Tooltip.init(edit_soc_med, {
        html: "Edit Social Media links",
        position: "top"
      });
      let instance2 = M.Tooltip.init(edit_profile, {
        html: "Edit Profile Info",
        position: "top"
      });
      this.setState({
        tooltip_avatar: instance,
        social_media_eddit_tooltip: edit_soc_med,
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

      this.setState({ profile: res.data }, this.mapSocialMediaLinks);
    });
  };

  mapSocialMediaLinks = () => {
    let { social_media } = this.state.profile;
    let {
      facebook,
      twitter,
      instagram,
      linkedIn,
      gitHub
    } = this.state.profile.social_media;
    if (social_media.facebook) {
      facebook = (
        <div id="facebook-link">
          <a href={social_media.facebook} style={{ color: "#01579b" }}>
            <i className="fab fa-facebook-square" />
          </a>
        </div>
      );
    }
    if (social_media.twitter) {
      twitter = (
        <div id="twitter-link">
          <a href={social_media.twitter} style={{ color: "#03a9f4" }}>
            <i className="fab fa-twitter-square" />
          </a>
        </div>
      );
    }
    if (social_media.instagram) {
      instagram = (
        <div id="instagram-link">
          <a href={social_media.instagram} style={{ color: "#d81b60" }}>
            <i className="fab fa-instagram" />
          </a>
        </div>
      );
    }
    if (social_media.linkedIn) {
      linkedIn = (
        <div id="linkedIn-link">
          <a href={social_media.linkedIn} style={{ color: "#2196f3" }}>
            <i className="fab fa-linkedin" />
          </a>
        </div>
      );
    }
    if (social_media.gitHub) {
      gitHub = (
        <div id="gitHub-link">
          <a href={social_media.gitHub} style={{ color: "#424242" }}>
            <i className="fab fa-github-square" />
          </a>
        </div>
      );
    }
    this.setState({
      facebook: facebook,
      twitter: twitter,
      instagram: instagram,
      linkedIn: linkedIn,
      gitHub: gitHub
    }, this.mapProfileClasses);
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

  renderSocialMediaLinks = () => {
    return (
      <div className="social-media-links">
        {this.state.facebook}
        {this.state.twitter}
        {this.state.instagram}
        {this.state.linkedIn}
        {this.state.gitHub}
      </div>
    );
  };

  renderSocialMediaEdditButton = () => {
    return (
      <div id="edit-social-media-links" className="fixed-action-btn">
        <a
          id="social-media-eddit-button"
          className="btn-floating btn blue darken-4"
        >
          <i className="large material-icons">mode_edit</i>
        </a>
        <ul>
          <li>
            <a
              target="gitHub"
              onClick={this.changeSocialMediaLink}
              className="btn-floating btn-small grey darken-3"
            >
              <i className="fab fa-github" />
            </a>
          </li>
          <li>
            <a
              target="instagram"
              onClick={this.changeSocialMediaLink}
              className="btn-floating btn-small pink darken-1"
            >
              <i className="fab fa-instagram" />
            </a>
          </li>
          <li>
            <a
              target="twitter"
              onClick={this.changeSocialMediaLink}
              className="btn-floating btn-small light-blue"
            >
              <i className="fab fa-twitter" />
            </a>
          </li>
          <li>
            <a
              target="linkedIn"
              onClick={this.changeSocialMediaLink}
              className="btn-floating btn-small blue"
            >
              <i className="fab fa-linkedin-in" />
            </a>
          </li>
          <li>
            <a
              target="facebook"
              onClick={this.changeSocialMediaLink}
              className="btn-floating btn-small light-blue darken-4"
            >
              <i className="fab fa-facebook-f" />
            </a>
          </li>
        </ul>
      </div>
    );
  };

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
  onSocialMediaUrlChange = e => {
    this.setState({ new_social_media_url: e.target.value });
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

  changeSocialMediaLink = e => {
    //e.preventDefault();
    if (e.target.target) {
      let elem = document.getElementById("social-media-edit-input");
      if (elem.classList.contains("scale-in")) {
        elem.classList.remove("scale-in");
        this.setState({ new_social_media_url_flag: "" });
      } else {
        elem.classList.add("scale-in");
        elem.firstChild.placeholder = e.target.target + " url";
        this.setState({ new_social_media_url_flag: e.target.target });
      }
    } else {
      let elem = document.getElementById("social-media-edit-input");
      if (elem.classList.contains("scale-in")) {
        elem.classList.remove("scale-in");
        this.setState({ new_social_media_url_flag: "" });
      } else {
        elem.classList.add("scale-in");
        elem.firstChild.placeholder = e.target.parentNode.target + " url";
        this.setState({
          new_social_media_url_flag: e.target.parentNode.target
        });
      }
    }
  };

  uploadUpdatedSocialMediaUrl = e => {
    e.preventDefault();
    let new_url = this.state.new_social_media_url;

    if(new_url.slice(0, 6) !== "https://" || new_url.slice(0, 5) !== "http://"){
      new_url = "https://" + new_url;
    }

    axios
      .put(
        `${"/api/profile-update-social-media-url"}/${this.state.profile._id}/${
          this.state.new_social_media_url_flag
        }`,
        { new_url: new_url }
      )
      .then(res => {
        M.toast({html: res.data.message});
        this.setState({new_social_media_url: "", new_social_media_url_flag: ""});
        let elem = document.getElementById("social-media-edit-input");
        elem.classList.remove("scale-in");
        this.loadUserProfile(this.props.location.pathname);
      });
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
                {this.renderSocialMediaLinks()}
                {this.state.edditable?
                  <div className="social-media-FAB">
                    {this.renderSocialMediaEdditButton()}
                    <div
                      id="social-media-edit-input"
                      className="scale-transition scale-out"
                    >
                      <input
                        value={this.state.new_social_media_url}
                        onChange={this.onSocialMediaUrlChange}
                        placeholder="Url"
                      />
                      <button
                        onClick={this.uploadUpdatedSocialMediaUrl}
                        className="btn-small"
                      >
                        <i className="material-icons">send</i>
                      </button>
                    </div>
                  </div>:""}
                <div className="divider"/>
                <div className="profile-contact-info">
                  <p>{profile.displayName}</p>
                  {this.renderUserStatus()}
                  <p>Chuyên ngành: {this.state.profile.major?this.state.profile.major:"Kỹ Thuật phần mềm"}</p>
                  <div id="profile-contact-info">
                    <h6>Thông tin cá nhân</h6>
                    <p>Email: {this.state.profile.email?this.state.profile.email:"admin@gmail.com"}</p>
                    <p>Số điện thoại: {this.state.profile.phone?this.state.profile.phone:"0798990797"}</p>
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
                        <h6>Thông tin cá nhân</h6>
                      </div>
                      <ul className="bio-ul">
                        <li className="bio-li">
                          <h4 className="bio-li-header">About Me:</h4>
                          <p>{this.state.profile.about_me?this.state.profile.about_me: "Tôi là Minh Thư"}</p>
                        </li>
                        <li className="bio-li">
                          <h4 className="bio-li-header">Lớp:</h4>
                          <p> {this.state.profile.interests?this.state.profile.interests: "518H0062"}</p>
                        </li>
                        <li className="bio-li">
                          <h4 className="bio-li-header">Chuyên ngành:</h4>
                          <p> {this.state.profile.skills?this.state.profile.skills:"Kỹ thuật phần mềm"}</p>
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
      return <p>Quản trị viên</p>;
    } else if (user.teacher) {
      return <p>Phòng Khoa</p>;
    } else {
      return <p>Sinh Viên</p>;
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
          <h4>Thay đổi thông tin</h4>
          <div className="modal-content modal-profile-content">
            <div className="modal-left">
              <div className="modal-major">
                <p>Chuyên ngành:</p>
                <input onChange={this.onMajorChange}></input>
              </div>
              <h6>Thông tin liên lạc</h6>
              <div className="divider"/>
              <p>Số điện thoại:</p><input value={this.state.new_phone} onChange={this.onPhoneChange} type="text" ></input>
            </div>
            <div className="modal-right">
              <div className="modal-about-me">
                <p>Về tôi:</p>
                <textarea value={this.state.new_aboutMe} onChange={this.onAboutMeChange} placeholder="Thông tin bản thân"></textarea>
                <p>Lớp:</p>
                <textarea value={this.state.new_interests} onChange={this.onInterestsChange} placeholder="Lớp..."></textarea>
                <p>Chuyên ngành:</p>
                <textarea value={this.state.new_skills} onChange={this.onSkillsChange} placeholder="Chuyên ngành là gì..."></textarea>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a className="btn-small" onClick={this.submitProfileInfo}>Cập nhật</a>
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
