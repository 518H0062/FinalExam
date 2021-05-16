import React, { Component } from "react";
import AlertBox from "./AlertBox";
import {WEATHER_ALERT} from './types';
import axios from 'axios';
class Alerts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alerts: null,
      skip: 0
    }
  }

  componentDidMount(){
    this.initialLoadAlerts();
  }

  renderAlerts = () => {
    switch (this.state.alerts) {
      case null:
        return "";
      default:
      let {alerts} = this.state;
      return (
        alerts.map(data => (
          <AlertBox
            type={data.type}
            content={data.content}
            date={data.postDate}
            key={data["_id"]}
            alert_id={data["_id"]}
          />
        ))
      );
    }
  }

  loadMore = (e) => {
    e.preventDefault();
    let updatedAlerts = this.state.alerts;
    axios.get(`${"/api/main-alert"}/${(this.state.skip + 5)}`)
    .then(res => {
      updatedAlerts = this.state.alerts.concat(res.data);
      this.setState({alerts: updatedAlerts, skip: (this.state.skip + 5)});
    })
  }

  initialLoadAlerts = () => {
    axios.get(`${"/api/main-alert"}/${this.state.skip}`)
    .then(res => {
      this.setState({alerts: res.data});
    })
  }

  render() {
    return(
      <React.Fragment>
        {this.renderAlerts()}
          <a className="btn" onClick={this.loadMore} href="#!">Hiển thị thêm</a>
      </React.Fragment>
    );
  }
}

export default Alerts;
