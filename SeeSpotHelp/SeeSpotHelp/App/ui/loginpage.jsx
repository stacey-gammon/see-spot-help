"use strict"

var React = require("react");
var FacebookLogin = require("./facebooklogin");
var LoginStore = require("../stores/loginstore");

var LoginPage = React.createClass({
	getInitialState: function () {
		return {
			loading: false,
			error: false
		}
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	checkAuthentication: function () {
		console.log('LoginPage.checkAuthentication');

		if (LoginStore.isAuthenticated()) {
			delete sessionStorage.loginPageUserAuthenticating;
			console.log('LoginPage.checkAuthentication: authenticated!');
		} else if (LoginStore.isAuthenticating()) {
			this.setState({loading: true});
			return;
		} else if (sessionStorage.loginPageUserAuthenticating) {
			console.log('LoginPage.checkAuthentication: errors authenticating');
			delete sessionStorage.loginPageUserAuthenticating;
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
		this.checkAuthentication();
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
			<div style={{textAlign: 'center', width: '300px', margin: '0 auto'}}>
				{this.getMessage()}
				<FacebookLogin />
			</div>
		);
	},

	render: function () {
		return (<div className="loginPage text-center" style={{margin: '0 auto', maxWidth: '600px', textAlign: 'center'}}>
					<img src="images/logo.png" height="70px"/>
						{this.getLoadingText()}
					<br/>
					{this.getLoginButton()}
				</div>
		);
	}
});

module.exports = LoginPage;
