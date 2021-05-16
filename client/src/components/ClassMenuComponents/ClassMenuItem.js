// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import { iconType, iconColor } from "./iconTypes";

// class ClassMenuItem extends Component {
//   constructor(props) {
//     super(props);
//   }
//   dropdownClick = e => {
//     e.preventDefault();
//     if (e.target.target) {
//       var element = document.getElementById(e.target.target);
//       var element_a = document.getElementById(e.target.target + "a_tag");
//     } else {
//       var element = document.getElementById(e.target.parentElement.target);
//       //console.log(e.target.parentElement);
//       var element_a = document.getElementById(
//         e.target.parentElement.target + "a_tag"
//       );
//     }

//     //To show the Ul
//     if (!element.classList.contains("show")) {
//       element.classList.add("show");
//       element_a.classList.add("clicked");
//     } else {
//       element.classList.remove("show");
//       element_a.classList.remove("clicked");
//     }
//   };

//   renderMenu = () => {
//     if(this.props.user._id === this.props.class.teacher){
//       return this.teacherMenu();
//     }else {
//       return this.studentMenu();
//     }
//   }

//   teacherMenu = () =>{
//     return (
//       <React.Fragment>
//         <li>
//           <Link to={`${"/ClassAnnouncements"}/${this.props.class._id}`}>
//             Announcements
//           </Link>
//         </li>
//         <li>
//           <Link to={`${"/ClassContent"}/${this.props.class._id}`}>Content</Link>
//         </li>
//         <li>
//           <Link to={`${"/VerifyStudents"}/${this.props.class._id}`}>
//           Verify Students
//           {
//             this.props.class.unverifiedStudents.length?
//             <div className="verify-chip chip">{this.props.class.unverifiedStudents.length}</div>:
//             ""
//           }
//           </Link>
//         </li>
//       </React.Fragment>
//     );
//   }

//   studentMenu = () => {
//     return (
//       <React.Fragment>
//         <li>
//           <Link to={`${"/ClassAnnouncements"}/${this.props.class._id}`}>
//             Announcements
//           </Link>
//         </li>
//         <li>
//           <Link to={`${"/ClassContent"}/${this.props.class._id}`}>Content</Link>
//         </li>
//         <li>
//           <Link to={`${"/profile"}/${this.props.class.teacher}`}>Teacher</Link>
//         </li>
//       </React.Fragment>
//     );
//   }
//   checkVerified = () =>{
//     let _class = this.props.user.classes.find(_class => {
//       return _class.class_id === this.props.class._id;
//     });
//     if(_class){
//       return _class.verified || this.props.user.teacher;
//     } else {
//       return this.props.user.teacher;
//     }

//   }

//   render() {
//     if(this.checkVerified()){
//       return (
//         <React.Fragment>
//           <a
//             id={this.props.class._id + "a_tag"}
//             target={this.props.class._id}
//             onClick={this.dropdownClick}
//             className="menu-hoverable dropbtn"
//           >
//             <i className="left-icon material-icons" style={{color:iconColor(this.props.class.type)}}>
//               {iconType(this.props.class.type)}
//             </i>
//             <span>
//               {this.props.class.type}
//               {this.props.class.level}
//             </span>
//             <i className="right-icon material-icons">arrow_drop_down</i>
//           </a>
//           <ul id={this.props.class._id} className="class-item">
//             {this.renderMenu()}
//           </ul>
//         </React.Fragment>
//       );
//     }else{
//       return (
//       <a
//         id={this.props.class._id + "a_tag"}
//         target={this.props.class._id}
//         className="menu-hoverable dropbtn"
//       >
//         <i className="left-icon material-icons">close</i>
//         <span className="unverified">
//           {this.props.class.type}
//           {this.props.class.level}
//         </span>
//       </a>)
//     }

//   }
// }

// export default ClassMenuItem;
