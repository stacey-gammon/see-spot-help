"use strict"

import * as React from 'react';
import FacebookLogin from "./facebooklogin";
import Utils from './uiutils';
import LoginStore from '../stores/loginstore';
var Loader = require('react-loader');

export default class LoginPage extends React.Component<any, any> {
  constructor(props) {
    super(props);
    var logout = Utils.FindPassedInProperty(this, 'logout');
    this.state = {
      loading: LoginStore.authenticated === null,
      error: false,
      logout: logout
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  checkAuthentication () {
    console.log('LoginPage.checkAuthentication');

    if (LoginStore.isAuthenticated() &&
      LoginStore.getUser() &&
      LoginStore.getUser().inBeta) {
      this.context.router.push("/profilePage");

    // Don't use the getUser version as that may automatically try to authenticate us and we
    // want to avoid a loop if authentication fails for some reason.
    } else if (LoginStore.isAuthenticated() &&
      LoginStore.getUser() &&
      !LoginStore.getUser().inBeta) {
      this.context.router.push("/enterBetaCode");
    }
  }

  componentDidMount () {
    if (this.state.logout) {
      LoginStore.logout();
    } else {
      this.checkAuthentication();
    }
    LoginStore.addChangeListener(this.onChange.bind(this));
  }

  componentWillUnmount () {
    LoginStore.removeChangeListener(this.onChange.bind(this));
  }

  onChange () {
    console.log('LoginPage.onChange');
    this.checkAuthentication();
  }

  getMessage () {
    if (this.state.errorMessage) {
      var messageStyle = this.state.error ? "alert alert-danger" : "alert alert-success";
      return (
        <div className={messageStyle}>
          {this.state.errorMessage}
        </div>
      );
    } else {
      return null;
    }
  }

  onError (error) {
    this.setState({loading: false, error: true, errorMessage: "Login failed"});
  }

  onLoginAction () {
    this.setState({loading: true});
  }

  getLoginButton () {
    return (
      <div>
        {this.getMessage()}
        <FacebookLogin onError={this.onError.bind(this)} loginAction={this.onLoginAction.bind(this)}/>
      </div>
    );
  }

  render () {
    return (
        <div className="loginPage text-center" style={{margin: '0 auto', maxWidth: '600px', textAlign: 'center'}}>
          <div className='header-bar'>
            <img src="images/logo.png" height="70px"/>
          </div>
          <Loader loaded={!this.state.loading} color="rgba(0,0,0,0.2)">
            <div className='login-page'>
              {this.getLoginButton()}
            </div>
          </Loader>
        </div>
    );
  }
}
