'use strict'

var React = require('react');
var LoginStore = require("../stores/loginstore");
var LoginService = require("../core/loginservice");

var FacebookLogin = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	loginAction: function () {
		if (LoginStore.getUser()) {
			LoginStore.logout();
			delete sessionStorage.loginPageUserAuthenticating;
			this.context.router.push('/loginpage');
		} else {
			sessionStorage.loginPageUserAuthenticating = true;
			LoginStore.authenticate();
		}
	},

	render: function () {
		var style = {};
		if (this.props.displayInline) {
			style = {display: 'inline-block'};
		}
		var text = LoginStore.getUser() ? "Log out" : "Log in with facebook";
		var className = LoginStore.getUser() ? "btn btn-default " : "btn btn-info has-spinner";

		if (LoginStore.isAuthenticating()) {
			className += " active";
		}

		return (
			<div style={style} className="text-center">
				<button className={className} onClick={this.loginAction}>
    				<span className="spinner"><i className="fa fa-spinner"></i></span>
					{text}
				</button>
			</div>
			);
	}
});

module.exports = FacebookLogin;
