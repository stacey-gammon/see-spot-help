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
		return (<div className="loginPage" style={{margin: '0 auto', maxWidth: '600px'}}>
					<h1>Get started with The Shelter Helper!</h1>
					<br/>
					<p style={{textAlign: 'center'}}><a href="#searchpage">Search Adotpables</a></p>
					<p style={{textAlign: 'center'}}><a href="#searchpage">Search Volunteer Groups</a></p>
					<p style={{textAlign: 'center'}}>or Login to create your own!</p>
					<div style={{textAlign: 'center', width: '300px', margin: '0 auto'}}>
						<FacebookLogin/>
					</div>
				</div>
		);
	}
});

module.exports = LoginPage;
