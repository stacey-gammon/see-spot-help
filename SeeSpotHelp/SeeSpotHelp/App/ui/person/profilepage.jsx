"use strict";

var React = require("react");
var Volunteer = require("../../core/volunteer");
var VolunteerGroup = require("../../core/volunteergroup");
var Utils = require("../../core/utils");
var FacebookLogin = require("../facebooklogin");
var GroupInfoBox = require("../group/groupinfobox");
var AddNewGroup = require("../group/addnewgroup");
var SearchPage = require("../searchpage");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var VolunteerStore = require("../../stores/volunteerstore");
var AnimalScheduleTab = require("../animal/animalscheduletab");
var LoginPage = require("../loginpage");

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
		var state = {
			user: LoginStore.getUser()
		};
		Utils.LoadOrSaveState(state);
		return state;
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
				user: LoginStore.getUser()
			});
	},

	render: function () {
		// There is no user and none is going to be downloaded, we must prompt them to log in.
		// TODO: when we open the app up to the public, we must be able to handle non-logged in
		// users.
		if (!LoginStore.getUser() && !LoginStore.listenersAttached) {
			this.context.router.push("/loginpage");
		}
		if (this.state.user) {
			var heading = "Hello, " + this.state.user.name;
			return (
				<div>
					<div className="media padding">
						<div className="media-body">
						<h1>{heading}</h1>
						</div>
					</div>
					<Tabs defaultActiveKey={1}>
						<Tab eventKey={1} title="Groups">
							<UserGroupsTab user={this.state.user}/>
						</Tab>
						<Tab eventKey={2} title="Activity">
							<UserActivityTab user={this.state.user}/>
						</Tab>
						<Tab eventKey={3} title="Calendar">
							<AnimalScheduleTab memberId={this.state.user.id}/>
						</Tab>
					</Tabs>
					<br/><br/>
				</div>
			);
		} else {
			return (
				<LoginPage/>
			);
		}
	}
});

module.exports = ProfilePage;
