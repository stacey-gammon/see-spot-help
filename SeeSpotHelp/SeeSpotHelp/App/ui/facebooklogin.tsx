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

  render: function () {
    var style = {};
    if (this.props.displayInline) {
      style = {display: 'inline-block'};
    }
    var text = LoginStore.getUser() ? "Log out" : "Login with Facebook";
    var className = LoginStore.getUser() ? "btn btn-default " : "btn btn-info btn-big";

    return (
      <div style={style} className="text-center">
        <button className={className} onClick={this.loginAction} >
          {text}
        </button>
      </div>
      );
  }
});

module.exports = FacebookLogin;
