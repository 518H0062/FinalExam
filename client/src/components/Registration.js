import React, { Component } from "react";
import axios from "axios";
import * as M from 'materialize-css';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password2: "",
      EMPLID: ""
    };
  }
//   redirectToLogin = () =>{
//     this.props.history.push("/login");
//   }
  onFirstNameChange = e => {
    e.preventDefault();
    this.setState({ first_name: e.target.value });
  };
  onLastNameChange = e => {
    e.preventDefault();
    this.setState({ last_name: e.target.value });
  };
  onEmailChange = e => {
    e.preventDefault();
    this.setState({ email: e.target.value });
  };
  onPasswordChange = e => {
    e.preventDefault();
    this.setState({ password: e.target.value });
  };
  onPassword2Change = e => {
    e.preventDefault();
    this.setState({ password2: e.target.value });
  };
  onEMPLIDChange = e => {
    e.preventDefault();
    console.log(e.target.value);
    this.setState({ EMPLID: e.target.value });
  };
  registrationSubmit = e => {
     e.preventDefault();
    console.log("SUBMITTED!");
    let newUser = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      EMPLID: this.state.EMPLID
    }
    axios.post("/api/register", newUser).then(
      res => {
        if(res.data != "redirect"){
          M.toast({html: res.data[0].msg});
        }else if(res.data == "redirect"){
        //   this.redirectToLogin();
        alert("Tạo tài khoản thành công")
        }
      }
    )
  };
  render() {
    return (
      <div className="container">
        <div className="row">
          <div id="register-form">
            <div className="reusable-header">
              <h4>Tạo tài khoản cho Phòng Khoa</h4>
            </div>
            <div className="register-input-fields">
              <form
                id="registration"
                className=""
                onSubmit={this.registrationSubmit}
              >
                <div className="row">
                  <div className="input-field col s6">
                    <input
                      placeholder="TÊN PHÒNG"
                      name="first_name"
                      type="text"
                      className="validate"
                      value={this.state.first_name}
                      onChange={this.onFirstNameChange}
                      required
                    />
                    <label htmlFor="first_name">TÊN PHÒNG</label>
                  </div>
                  <div className="input-field col s6">
                    <input
                      name="last_name"
                      type="text"
                      className="validate"
                      value={this.state.last_name}
                      onChange={this.onLastNameChange}
                      required
                    />
                    <label htmlFor="last_name">TÊN KHOA</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      name="email"
                      type="email"
                      className="validate"
                      value={this.state.email}
                      onChange={this.onEmailChange}
                      required
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
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
                  <div className="input-field col s12">
                    <input
                      name="password2"
                      type="password"
                      className="validate"
                      value={this.state.password2}
                      onChange={this.onPassword2Change}
                      required
                    />
                    <label htmlFor="password2">Xác nhận mật khẩu</label>
                  </div>
                </div>
                <div className="row">

                    <div className="input-field inline">
                      <input
                        name="EMPLID"
                        type="text"
                        className="validate"
                        value={this.state.EMPLID}
                        onChange={this.onEMPLIDChange}
                        required
                      />
                      <label className="register-login-labels"  htmlFor="EMPLID">EMPLID</label>
                      <span
                        className="helper-text"
                        data-error="required"
                        data-success="right"
                      >
                        Nhập ID cho Phòng Khoa
                      </span>
                    </div>

                </div>
                <div className="col s12 m6 l6 lx6">
                  <input type="submit" value="Xác Nhận" className="btn" />
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>

    );
  }
}
