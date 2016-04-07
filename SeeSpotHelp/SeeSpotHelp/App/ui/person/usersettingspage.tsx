"use strict"

var React = require("react");
var ReactBootstrap = require("react-bootstrap");
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;

var BasicSettingsTab = require("./basicsettingstab");
var PrivacySettingsTab = require("./privacysettingstab");

var Volunteer = require("../../core/volunteer");
var FacebookLogin = require("../facebooklogin");
var LoginStore = require("../../stores/loginstore");

var UserSettingsPage = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			updated: false
		}
	},

	settingsUpdated: function() {
		this.setState({
			updated: true
		});
	},

	render: function () {
		// There is no user and none is going to be downloaded, we must prompt them to log in.
		// TODO: when we open the app up to the public, we must be able to handle non-logged in
		// users.
		if (!LoginStore.getUser() && !LoginStore.listenersAttached) {
			this.context.router.push("/loginpage");
		}
		var header = this.state.updated ? "Settings Updated!" : "Settings";

		if (LoginStore.user) {
			return (
				<div>
					<div className="media padding">
						<div className="media-body">
						<h1>{header}</h1>
						</div>
					</div>
					<Tabs defaultActiveKey={1}>
						<Tab eventKey={1} title="Basic">
							<BasicSettingsTab onChange={this.settingsUpdated}/>
						</Tab>
						<Tab eventKey={2} title="Privacy">
							<PrivacySettingsTab onChange={this.settingsUpdated}/>
						</Tab>
					</Tabs>
					<br/><br/>
				</div>
			);
		} else {
			return (
				<div>
					<h1>To get started, log in with facebook</h1>
					<FacebookLogin />
				</div>
			);
		}
	}
});

module.exports = UserSettingsPage;
