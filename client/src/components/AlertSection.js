import React, { Component } from 'react';
import Alerts from './AlertComponents/Alerts'

class AlertSection extends Component {
  constructor(props){
    super(props);

    this.state = {term: " "};
  }
  render() {
    return (
      <div id="alert-section">
        <Alerts />
      </div>

    );
  }
}


export default AlertSection;
