import React, { Component } from "react";
import axios from 'axios';
import * as M from 'materialize-css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }
  redirectHome = () =>{
    this.props.history.push("/");
  }
  onEmailChange = e => {
    e.preventDefault();
    this.setState({ email: e.target.value });
  };
  onPasswordChange = e => {
    e.preventDefault();
    this.setState({ password: e.target.value });
  };
  loginSubmit = e => {
      e.preventDefault();
      let user = {
          email: this.state.email,
          password: this.state.password
      };
      axios.post("/api/login-local", user, {withCredentials: true}).then(res =>{
        setTimeout(this.redirectHome(), 2000);
      });
  }
  render() {
    return (

      <div className="container">
        <div className="row">
          <div id="login-form">
              <div className="reusable-header">
                <h4>Đăng nhập vào hệ thống</h4>
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
                        name="email"
                        type="email"
                        className="validate"
                        value={this.state.email}
                        onChange={this.onEmailChange}
                        required
                      />
                      <label className="register-login-labels " htmlFor="email">Email</label>
                    </div>
                  </div>
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
                      <label className="register-login-labels" htmlFor="password">Mật khẩu</label>
                    </div>
                  </div>
                  <div className="">
                    <input type="submit" value="Đăng Nhập" className="btn" />
                  </div>
                </form>
              </div>
          </div>
        </div>
      </div>

    );
  }
}

export default Login;
