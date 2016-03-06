'use strict'

var React = require('react');
var LoginStore = require("../stores/loginstore");
var LoginService = require("../core/loginservice");

var FacebookLogin = React.createClass({
	loginAction: function () {
		if (LoginStore.getUser()) {
			LoginService.logout();
		} else {
			LoginService.loginWithFacebook();
		}
	},

	render: function () {
		var text = LoginStore.user ? "Log out" : "Log in";
		var className = LoginStore.user ? "btn" : "btn btn-primary";
		return (
			<div className="text-center">
				<button className={className} onClick={this.loginAction}>
					{text}
				</button>
			</div>
			);
	}
});

module.exports = FacebookLogin;
