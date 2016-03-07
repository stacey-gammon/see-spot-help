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
		var style = {};
		if (this.props.displayInline) {
			style = {display: 'inline-block'};
		}
		var text = LoginStore.user ? "Log out" : "Log in";
		var className = LoginStore.user ? "btn btn-default" : "btn btn-info";
		return (
			<div style={style} className="text-center">
				<button className={className} onClick={this.loginAction}>
					{text}
				</button>
			</div>
			);
	}
});

module.exports = FacebookLogin;
