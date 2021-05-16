import React, { Component } from "react";
import axios from "axios";
import * as M from 'materialize-css';
import FixedMenu from "./Fixedmenu";

export default class changePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      password2: "",
      password3: "",
      userId: "",
    };
  }
  onPasswordChange = e => {
    e.preventDefault();
    this.setState({ password: e.target.value });
  };
  onPassword2Change = e => {
    e.preventDefault();
    this.setState({ password2: e.target.value });
  };

  onPassword3Change = e => {
    e.preventDefault();
    this.setState({ password3: e.target.value });
  };
  changePassSubmit = e => {
    e.preventDefault();
    console.log("changePassSubmit");

    let newPassword = {
      password: this.state.password,
      password2: this.state.password2,
      password3: this.state.password3,
      userId:this.state.userId
    }
    axios.post("/api/changePassword", newPassword).then(
      res => {
        M.toast({ html: res.data.message })
      })
  };

  componentDidMount() {
    this.setState({userId:this.props.match.params.id});
  }
  render() {
    return (

      <div className="container">
        <div className="row">
          <div id="login-form">
            <div className="reusable-header">
              <h4>Thay đổi mật khẩu</h4>
            </div>

            <div className="login-input-fields">
              <form
                id="login"
                className=""
                onSubmit={this.loginSubmit}
              >
                <div className="row">
                  <div className="input-field">
                    <input
                      name="password"
                      type="password"
                      className="validate"
                      value={this.state.password}
                      onChange={this.onPasswordChange}
                      required
                    />
                    <label htmlFor="password">Mật khẩu</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field">
                    <input
                      name="password2"
                      type="password"
                      className="validate"
                      value={this.state.password2}
                      onChange={this.onPassword2Change}
                      required
                    />
                    <label htmlFor="password2">Mật khẩu mới</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field">
                    <input
                      name="password3"
                      type="password"
                      className="validate"
                      value={this.state.password3}
                      onChange={this.onPassword3Change}
                      required
                    />
                    <label htmlFor="password2">Xác nhận mật khẩu mới</label>
                  </div>
                </div>
                <div className="">
                  <input type="submit" value="Xác nhận" className="btn" onClick={this.changePassSubmit} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
