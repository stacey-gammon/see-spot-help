"use strict"

var React = require("react");
var FacebookLogin = require("./facebooklogin");
var LoginStore = require("../stores/loginstore");

var LoginPage = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
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
		if (LoginStore.getUser() && LoginStore.getUser().inBeta) {
			this.context.router.push("/profilePage");
		} else if (LoginStore.getUser()) {
			this.context.router.push("/enterBetaCode");
		}
	},

	render: function () {
		return (<div className="loginPage text-center" style={{margin: '0 auto', maxWidth: '600px', textAlign: 'center'}}>
					<img src="images/logo.png" height="70px"/>
					<br/>
					<div style={{textAlign: 'center', width: '300px', margin: '0 auto'}}>
						<FacebookLogin/>
					</div>
				</div>
		);
	}
});

module.exports = LoginPage;
