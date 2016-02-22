'use strict'

var React = require('react');
var LoginStore = require("../stores/loginstore");
var LoginService = require("../core/loginservice");

var FacebookLogin = React.createClass({
    loginAction: function () {
        if (LoginStore.user) {
            LoginService.logout();
        } else {
            LoginService.loginWithFacebook();
        }
    },

    render: function () {
        var text = LoginStore.user ? "Log out" : "Log in";
        return (
            <div>
                <button className="btn" onClick={this.loginAction}>
                    {text}
                </button>
            </div>
            );
    }
});

module.exports = FacebookLogin;
