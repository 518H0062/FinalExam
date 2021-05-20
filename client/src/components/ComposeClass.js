import React, { Component } from "react";
import axios from "axios";
import * as M from "materialize-css";
import Fixedmenu from "./Fixedmenu";

class ComposeClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teachers: [],
      teacherList: "",
      classes: [],
      classLevelList: "",
      typeSelected: "",
      levelSelected: "",
      teacherSelected: "",
      classSubject: "",
      classDescription: "",
      classSection: "",
      initClassType: "",
      initClassLevel: "",
      initTeacherList: ""
    };
  }

  destroyFormInstance = () => {
    if(this.state.initClassType != "")
      this.state.initClassType.destroy();
    if(this.state.initClassLevel != "")
      this.state.initClassLevel.destroy();
    if(this.state.initTeacherList != "")
      this.state.initTeacherList.destroy();
  }

  // When the component mounts, it will call the iniClassType function
  // to initialize the materializeCSS form.
  componentDidMount() {
    this.initClassType();
  }

  componentWillUnmount() {
    this.destroyFormInstance();
  }

  onSubjectChange = e => {
    e.preventDefault();
    this.setState({classSubject: e.target.value});
  }

  // Replace the default description of the currently selected class
  // with a custom or edited text and stores it in the state.
  onDescriptionChange = e => {
    e.preventDefault();
    this.setState({classDescription: e.target.value});
  }

  onSectionChange = e => {
    e.preventDefault();
    this.setState({classSection: e.target.value});
  }

  // Stores the selected class type in to the state, the value is _id
  // of the class_template mongoDB object, then calls the getClassNumberList
  // function after the state is set
  selectedClassType = e =>{
    e.preventDefault();
    this.setState({typeSelected: e.target.value}, this.getClassNumberList);
  }

  // Stores the class level within the state and looks
  // through the classes array to find the description of the class
  selectedClassLevel = e =>{
    e.preventDefault();
    let _class = this.state.classes.find(des =>{
        return des._id == e.target.value;
    });
    this.setState({levelSelected: _class.level,
      classDescription: _class.description,
    classSubject: _class.subject
  });
  }

  // Stores the _id of the Users MongoDB collection in to the state
  selectedTeacher = e => {
    e.preventDefault();
    this.setState({teacherSelected: e.target.value});
  }

  // This function is called when the component mounts,
  // it initializes the MaterializeCSS form javascript instance
  initClassType = () =>{
    let elem = document.getElementById("cType");
    let instance = M.FormSelect.init(elem);
    this.setState({initClassType: instance});
  }

  // Searches the MongoDB class_template collection to find all objects that
  // have a specific, selected class type and store those classes within the state
  // afterwards it calls the createClassLevelList function to fill in the form of
  // the class Level
  getClassNumberList = () => {
    axios.get(`${"/api/class_template"}/${this.state.typeSelected}`).then(res=>{
      this.setState({classes: res.data}, this.createClassLevelList);
    });
  }

  // Creates an array of <option> tags from the classes that were extracted from the
  // database and stores them in to the state, then call the initClassLevel to initialize
  // the materializeCSS form
  createClassLevelList = () =>{
    let classes = this.state.classes;
    let numberList = classes.map( num =>{
      return(
        <option value={num._id} key={`${num._id}level`}>
          {num.level}
        </option>
      );
    });
    this.setState({classLevelList: numberList}, this.initClassLevel);
  }

  // Initializes the materializeCSS form and stores the instance in the state,
  // then calls the getTeacherList function
  initClassLevel = () => {
    let elem = document.getElementById("cNum");
    let instance = M.FormSelect.init(elem);
    this.setState({initClassLevel: instance}, this.getTeacherList);
  }

  // Grabs a list of teachers from mongoDB based on the selected type, stores
  // them within the state and calls the createTeacherList function.
  getTeacherList = () => {
    axios.get(`${"/api/teacher-list"}/${this.state.typeSelected}`).then(res=>{
      this.setState({teachers: res.data}, this.createTeacherList);
    });
  }

  // Generates an array of <option> tags featuring the teachers, with the value
  // of the tags being the _id of the object of the Users collection in mongoDB,
  // and stores them within the state. Then calls the initTeachers function to
  // initialize the materializeCSS form instance
  createTeacherList = () =>{
    let teachers = this.state.teachers;
    let teacherList = teachers.map( num =>{
      return(
        <option value={num._id} key={`${num._id}teachers`}>
          {num.displayName}
        </option>
      );
    });
    this.setState({teacherList: teacherList}, this.initTeachers);
  }

  // Initializes the materializeCSS form instance for the teacher list
  initTeachers = () => {
    let elem = document.getElementById("teachers");
    let instance = M.FormSelect.init(elem);
    this.setState({initTeacherList: instance});
  }

  onClassSubmit = e => {
    e.preventDefault();
    if(this.state.teacherSelected && this.state.levelSelected && this.state.typeSelected){
      let _class = this.state;
      let new_class = {
      type: _class.typeSelected,
      level: _class.levelSelected,
      subject: _class.classSubject,
      section: _class.classSection,
      teacher: _class.teacherSelected,
      description: _class.classDescription
    };
    axios.post("/api/create-class", new_class).then(res => {
      let teacher = {
        classes: {class_id: res.data.id, verified: true},
        user: _class.teacherSelected
      };
      axios.put("/api/add_class_to_user/teacher", teacher).then(res => {
      });
      M.toast({html: res.data.message});
    });
  } else if(!this.state.teacherSelected) {
    M.toast({html: "Please select an instructor"});
  } else if(!this.state.levelSelected) {
    M.toast({html: "Please select class level"});
  } else if(!this.state.typeSelected) {
    M.toast({html: "Please select class type"});
  }
    
  };

  render() {
    return (
      <div id="content-section-container" className="container">
        <div className="row" id="content-area-row">
          <div className="col s12 m2 l2 xl2">
            <Fixedmenu />
          </div>
          <div id="class-db-input" className="col s12 m6 l7 xl7">

            <div className="reusable-header">
              <h4>Create a new class section</h4>
            </div>
            <div className="create-section-body">
              <form id="create-section" className="" onSubmit={this.onClassSubmit}>
                <div className="row">
                  <div className="col s3 input-field">
                    <select defaultValue="1" id="cType" onChange={this.selectedClassType}>
                      <option disabled value="1">Class Type</option>
                      <option value="CSC">CSC</option>
                      <option value="ENG">ENG</option>
                      <option value="MTH">MTH</option>
                    </select>
                     <label>Class Type</label>
                  </div>
                  <div className="col s3 input-field">
                    <select defaultValue="1" id="cNum" onChange={this.selectedClassLevel}>
                      <option disabled value="1">Class Level</option>
                      {this.state.classLevelList}
                    </select>
                      <label>Class Level</label>
                  </div>
                  <div className="input-field col s6">
                    <input
                      required
                      value={this.state.classSection}
                      id="class_section"
                      onChange={this.onSectionChange}
                      type="text"
                    />
                    <label>Class Section #</label>
                  </div>
                  <div className="col s12 input-field">
                    <select required defaultValue="1" id="teachers" onChange={this.selectedTeacher}>
                      <option disabled value="1">Select Teacher</option>
                        {this.state.teacherList}
                    </select>
                    <label>Teacher</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <h6>Class Subject</h6>
                    <input
                      required
                      value={this.state.classSubject}
                      id="class_subject"
                      onChange={this.onSubjectChange}
                      type="text"
                    />
                  </div>
                  <div className="input-field col s12">
                    <h6>Class Description</h6>
                    <input
                      required
                      value={this.state.classDescription}
                      id="class_description"
                      onChange={this.onDescriptionChange}
                      type="text"
                    />
                  </div>
                </div>
                <button type="submit" className="btn">
                  Create Class section
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ComposeClass;
