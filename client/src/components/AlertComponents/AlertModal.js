import React, { Component } from "react";
import * as anime from 'animejs';

export default class AlertModal extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    var cssSelector = anime.timeline();
    cssSelector.add({
        targets: '.modal',
        scale: [0, 1.2],
        duration: 300,
        easing: 'easeInOutQuart'
      });
  }
  render() {
    return (
      <React.Fragment>
        <div onClick={this.props.close} className="modal-underlay" />
        <div className="modal">
          <div className="modal-content">
            <h4>{this.props.type}</h4>
            <p>{this.props.alertMsg}</p>
          </div>
          <div className="modal-footer">
            <p>{this.props.date}</p>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
