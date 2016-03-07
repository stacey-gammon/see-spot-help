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
		this.context.router.push("/profilePage");
	},

	render: function () {
		console.log("LoginPage::render");
		return (<div className="loginPage" style={{margin: '20px 10px 20px 10px'}}>
					<h1>To get started, log in with your facebook account.</h1>
					<br/>
					<div style={{textAlign: 'center', width: '300px', margin: '0 auto'}}>
						<FacebookLogin/>
					</div>
				</div>
		);
	}
});

module.exports = LoginPage;
