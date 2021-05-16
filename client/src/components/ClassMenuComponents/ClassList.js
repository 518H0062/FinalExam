import React, { Component } from "react";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import ClassItem from "./ClassMenuItem";
import axios from "axios";

const initialState = {
  classes: [],
  classList: []
}
class ClassList extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount(){
    //this.setState({classes: this.props.classes}, this.generateClassList);
    this.generateClassList();
  }

  componentWillReceiveProps(nextProps){
      if(nextProps.classes.length > this.props.classes.length ||nextProps.classes.length < this.props.classes.length){
        this.setState(initialState, this.generateClassList);
      } else {
        for(let i = 0; i < nextProps.user.classes.length; i++){
          if(!this.props.user.teacher && nextProps.user.classes.length == this.props.user.classes.length){
            if(nextProps.user.classes[i].verified !== this.props.user.classes[i].verified){
              this.setState(initialState, this.generateClassList);
            }
          }
        }
      }
  }

  generateClassList = () => {
    let classes = this.props.classes;
    let classList = classes.map(cls => {
    return (
      <ClassItem key={cls._id} user={this.props.user} class={cls} />
    );
  });
  this.setState({classList: classList});
  }

  render() {
    return this.state.classList;
  }
}

export default ClassList;
