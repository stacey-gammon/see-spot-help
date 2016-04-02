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
			LoginService.logout();
			this.context.router.push('/loginpage');
		} else {
			console.log('authenticating from FacebookLogin');
			LoginStore.authenticate();
		}
	},

	render: function () {
		var style = {};
		if (this.props.displayInline) {
			style = {display: 'inline-block'};
		}
		var text = LoginStore.getUser() ? "Log out" : "Log in with facebook";
		var className = LoginStore.getUser() ? "btn btn-default" : "btn btn-info";
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
