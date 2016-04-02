'use strict'

var React = require('react');
var LoginStore = require("../stores/loginstore");
var LoginService = require("../core/loginservice");

var FacebookLogin = React.createClass({
	getInitialState: function () {
		var message = null;
		if (sessionStorage.authenticating) {
			if (!LoginStore.isAuthenticated) {
				message = "Something went wrong.";
			}
			delete sessionStorage.authenticating;
		}
		return {
			message: message,
			error: false
		};
	},


	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	loginAction: function () {
		if (LoginStore.getUser()) {
			LoginService.logout();
			this.context.router.push('/loginpage');
		} else {
			console.log('authenticating from FacebookLogin');
			var onSuccess = function () {
				this.setState({message: "Successfully logged in with facebook.", error: false});
			}.bind(this);
			var onError = function (error) {
				this.setState({message: "There was an error signing in with facebook.", error: true});
			}.bind(this);

			sessionStorage.authenticating = true;
			LoginStore.authenticate(onSuccess, onError);
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

	render: function () {
		var style = {};
		if (this.props.displayInline) {
			style = {display: 'inline-block'};
		}
		var text = LoginStore.getUser() ? "Log out" : "Log in with facebook";
		var className = LoginStore.getUser() ? "btn btn-default" : "btn btn-info";
		return (
			<div style={style} className="text-center">
				{this.getMessage()}
				<button className={className} onClick={this.loginAction}>
					{text}
				</button>
			</div>
			);
	}
});

module.exports = FacebookLogin;
