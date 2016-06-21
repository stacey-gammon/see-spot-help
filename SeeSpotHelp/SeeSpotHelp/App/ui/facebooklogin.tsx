'use strict'

import * as React from 'react';
import LoginStore from '../stores/loginstore';

export default class FacebookLogin extends React.Component<any, any> {
  public context: any;

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  loginAction() {
    this.props.loginAction();
    if (LoginStore.getUser()) {
      LoginStore.logout();
      //sessionStorage.setItem('loginPageUserAuthenticating', null);
      this.context.router.push('/loginpage');
    } else {
    //  sessionStorage.setItem('loginPageUserAuthenticating', 'true');
      LoginStore.authenticate(this.onAuthenticated.bind(this), this.onError.bind(this));
    }
  }

  onError(errorMessage) {
    this.setState({error: true, errorMessage: "Login Failed"});
    if (this.props.onError) {
      this.props.onError(errorMessage);
    }
  }

  onAuthenticated() {
    this.context.router.push('/profilePage');
  }

  createButton(className, text) {
    return (
      <div className="text-center">
        {this.getMessage()}
        <button className={className} onClick={this.loginAction.bind(this)} >
          {text}
        </button>
      </div>
    );
  }

  getMessage() {
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

  createLinkElement(className, text) {
      return (
        <div style={{display: 'inline-block'}} onClick={this.loginAction}>{text}</div>
    );
  }

  render() {
    var text = LoginStore.getUser() ? "Log out" : "Login with Facebook";
    var className = LoginStore.getUser() ? "btn btn-default " : "btn btn-info btn-big";

    if (this.props.useLink) {
      return this.createLinkElement(className, text);
    } else {
      return this.createButton(className, text);
    }
  }
}
