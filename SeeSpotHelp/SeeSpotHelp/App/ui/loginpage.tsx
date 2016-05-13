"use strict"

var React = require("react");
var FacebookLogin = require("./facebooklogin");
import Utils from './uiutils';
import LoginStore from '../stores/loginstore';
var Loader = require('react-loader');

var LoginPage = React.createClass({
  getInitialState: function () {
    var logout = Utils.FindPassedInProperty(this, 'logout');
    return {
      loading: false,
      error: false,
      logout: logout
    }
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  checkAuthentication: function () {
    console.log('LoginPage.checkAuthentication');

    if (LoginStore.isAuthenticated()) {
      sessionStorage.setItem('loginPageUserAuthenticating', null);
      console.log('LoginPage.checkAuthentication: authenticated!');
    } else if (LoginStore.isAuthenticating()) {
      this.setState({loading: true});
      return;
    } else if (sessionStorage.getItem('loginPageUserAuthenticating')) {
      sessionStorage.setItem('loginPageUserAuthenticating', null);
      // The user initiated a login but LoginStore completed without success, report
      // an error.
      this.setState({loading: false, error: true, message: "Login failed"});
      return;
    }

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
  },

  componentWillMount: function () {
    if (this.state.logout) {
      LoginStore.logout();
    } else {
      this.checkAuthentication();
    }
  },

  componentDidMount: function() {
    LoginStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function () {
    LoginStore.removeChangeListener(this.onChange);
  },

  onChange: function () {
    console.log('LoginPage.onChange');
    this.checkAuthentication();
  },

  getLoadingText: function () {
    if (this.state.loading) {
      return (
        <div className="text-center">
          <h1>Logging in...</h1>
        </div>
      );
    } else {
      return null;
    }
  },

  getMessage: function () {
    if (this.state.message) {
      var messageStyle = this.state.error ? "alert alert-danger" : "alert alert-success";
      return (
        <div className={messageStyle}>
          {this.state.message}
        </div>
      );
    } else {
      return null;
    }
  },

  getLoginButton: function () {
    return (
      <div>
        {this.getMessage()}
        <FacebookLogin />
      </div>
    );
  },

  render: function () {
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
});

module.exports = LoginPage;
