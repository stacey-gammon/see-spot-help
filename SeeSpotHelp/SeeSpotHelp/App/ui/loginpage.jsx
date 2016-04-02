"use strict"

var React = require("react");
var FacebookLogin = require("./facebooklogin");
var LoginStore = require("../stores/loginstore");

var LoginPage = React.createClass({
	getInitialState: function () {
		return {
			loading: false
		}
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	componentWillMount: function () {

		if (LoginStore.isAuthenticated()) {
			delete sessionStorage.authenticating;
		} else {
			if (sessionStorage.reloadRaceBug) {
			    delete sessionStorage.reloadRaceBug;
				this.setState({loading: true});
			    setTimeout(function() {
			        location.reload();
			    }, 2000)
				return;
			}
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

	componentDidMount: function() {
		LoginStore.addChangeListener(
			this.onChange,
			LoginStore.ChangeEventEnum.LOGGED_IN);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		// Avoid getUser calls to eliminate the potential for authenticate loops as it will
		// cause a getUser.
		if (LoginStore.user && LoginStore.user.inBeta) {
			this.context.router.push("/profilePage");
		} else if (LoginStore.user) {
			this.context.router.push("/enterBetaCode");
		}
	},

	getLoadingText: function () {
		if (this.state.loading) {
			return (
				<div className="text-center">
					<h1>Loggin in...</h1>
				</div>
			);
		} else {
			return null;
		}
	},

	render: function () {
		return (<div className="loginPage text-center" style={{margin: '0 auto', maxWidth: '600px', textAlign: 'center'}}>
					<img src="images/logo.png" height="70px"/>
						{this.getLoadingText()}
					<br/>
					<div style={{textAlign: 'center', width: '300px', margin: '0 auto'}}>
						<FacebookLogin/>
					</div>
				</div>
		);
	}
});

module.exports = LoginPage;
