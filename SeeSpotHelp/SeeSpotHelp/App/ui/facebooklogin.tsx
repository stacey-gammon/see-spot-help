'use strict'

var React = require('react');
import LoginStore from '../stores/loginstore';

var FacebookLogin = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  loginAction: function () {
    if (LoginStore.getUser()) {
      LoginStore.logout();
      sessionStorage.setItem('loginPageUserAuthenticating', null);
      this.context.router.push('/loginpage');
    } else {
      sessionStorage.setItem('loginPageUserAuthenticating', 'true');
      LoginStore.authenticate();
    }
  },

  createButton(className, text) {
    return (
      <div className="text-center">
        <button className={className} onClick={this.loginAction} >
          {text}
        </button>
      </div>
    );
  },

  createLinkElement(className, text) {
      return (
        <div style={{display: 'inline-block'}} onClick={this.loginAction}>{text}</div>
    );
  },

  render: function () {
    var text = LoginStore.getUser() ? "Log out" : "Login with Facebook";
    var className = LoginStore.getUser() ? "btn btn-default " : "btn btn-info btn-big";

    if (this.props.useLink) {
      return this.createLinkElement(className, text);
    } else {
      return this.createButton(className, text);
    }
  }
});

module.exports = FacebookLogin;
