"use strict";

var React = require("react");
var Volunteer = require("../../core/volunteer");
var VolunteerGroup = require("../../core/volunteergroup");
var FacebookLogin = require("../facebooklogin");
var GroupInfoBox = require("../group/groupinfobox");
var AddNewGroup = require("../group/addnewgroup");
var SearchPage = require("../searchpage");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var LoginActions = require("../../actions/loginactions");
var UserGroupsTab = require("./usergroupstab");
var UserActivityTab = require("./useractivitytab");
var ReactBootstrap = require("react-bootstrap");
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;
var ReactRouterBootstrap = require("react-router-bootstrap");

var ProfilePage = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	getInitialState: function () {
		var user = LoginStore.getUser();
		return {
			user: user
		}
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		this.setState(
			{
				user: LoginStore.user
			});
	},

	render: function () {
		console.log("ProfilePage::render");
		if (this.state.user) {
			return (
				<div>
					<div className="media padding">
						<div className="media-body">
						<h1>Hello, {this.state.user.name}</h1>
						</div>
						<div className="media-right">
							<FacebookLogin />
						</div>
					</div>
					<Tabs defaultActiveKey={1}>
						<Tab eventKey={1} title="Groups">
							<UserGroupsTab user={this.state.user}/>
						</Tab>
						<Tab eventKey={2} title="Activity">
							<UserActivityTab user={this.state.user}/>
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

module.exports = ProfilePage;
