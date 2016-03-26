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

	handleTabSelect: function(key) {
		this.setState({profileDefaultTabKey : key});
		// We aren't supposed to manipulate state directly, but it doesn't yet have the newly
		// selected tab that we want to save to local storage.
		var stateDuplicate = this.state;
		stateDuplicate.groupDefaultTabKey = key;
		Utils.LoadOrSaveState(stateDuplicate);
	},

	render: function () {
		// There is no user and none is going to be downloaded, we must prompt them to log in.
		// TODO: when we open the app up to the public, we must be able to handle non-logged in
		// users.
		if (!LoginStore.getUser() && !LoginStore.listenersAttached) {
			this.context.router.push("/loginpage");
		}
		var defaultKey = this.state.profileDefaultTabKey ? this.state.profileDefaultTabKey : 1;
		if (this.state.user) {
			var heading = "Hello, " + this.state.user.name;
			return (
				<div>
					<div className="media padding">
						<div className="media-body">
						<h1>{heading}</h1>
						</div>
					</div>
					<Tabs activeKey={defaultKey} onSelect={this.handleTabSelect}>
						<Tab eventKey={1} title="Groups">
							<UserGroupsTab user={this.state.user}/>
						</Tab>
						<Tab eventKey={2} title="Activity">
							<UserActivityTab user={this.state.user}/>
						</Tab>
						<Tab eventKey={3} title="Calendar">
							<AnimalScheduleTab view="profile"/>
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
