"use strict";

var React = require("react");
/* eslint-disable no-unused-vars */
var Link = require("react-router").Link;
var ReactBootstrap = require("react-bootstrap");
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;

var GroupInfoBox = require("./groupinfobox");
var GroupMembersTab = require("./groupmemberstab");
var GroupAnimalsTab = require("./groupanimalstab");
var GroupActivityTab = require("./groupactivitytab");
var GroupActionsBox = require("./groupactionsbox");
var AnimalScheduleTab = require("../animal/animalscheduletab");
/* eslint-enable no-unused-vars */

var Utils = require("../../core/utils");
var VolunteerGroup = require("../../core/volunteergroup");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var PermissionsStore = require("../../stores/permissionsstore");

var GroupHomePage = React.createClass({
	getInitialState: function() {
		var group = Utils.FindPassedInProperty(this, 'group');
		if (group) group = VolunteerGroup.castObject(group);

		var isSearchResult = Utils.FindPassedInProperty(this, 'isSearchResult');

		// Undefined will mess up LoadOrSaveState so make sure we explicitly have false.
		isSearchResult = isSearchResult ? true : false;

		var state = {
			user: LoginStore.user,
			group: group,
			fromSearch: isSearchResult,
			groupDefaultTabKey: null
		};

		Utils.LoadOrSaveState(state);

		// If the user doesn't have any 'last looked at' group, and nothing has been set,
		// see if we can grab one from the user.
		if (!state.group && LoginStore.getUser()) {
			var groups = GroupStore.getGroupsByUser(LoginStore.user);
			if (groups && groups.length > 0) {
				state.group = groups[0];
				Utils.LoadOrSaveState(state);
			}
		}

		return state;
	},

	loadDifferentGroup: function(group) {
		this.setState({
			group: group
		});
	},

	getPreviousButton: function() {
		if (this.state.fromSearch || !this.state.user) return null;
		var usersGroups = GroupStore.getGroupsByUser(this.state.user);
		if (!usersGroups) return null;

		var previousGroup = null;
		for (var i = 0; i < usersGroups.length; i++) {
			if (usersGroups[i].id == this.state.group.id) {
				break;
			}
			previousGroup = usersGroups[i];
		}
		if (previousGroup) {
			return (
				<button className="btn btn-default"
						onClick={this.loadDifferentGroup.bind(this, previousGroup)}>
					Prev
				</button>
			);
		}
	},

	getNextButton: function() {
		if (this.state.fromSearch || !this.state.user) return null;
		var usersGroups = GroupStore.getGroupsByUser(this.state.user);
		if (!usersGroups) return null;

		var nextGroup = null;
		var groupFound = false;
		for (var i = 0; i < usersGroups.length; i++) {
			if (groupFound) {
				nextGroup = usersGroups[i];
				break;
			}
			if (usersGroups[i].id == this.state.group.id) {
				groupFound = true;
			}
		}
		if (nextGroup) {
			return (
				<button className="btn btn-default"
						onClick={this.loadDifferentGroup.bind(this, nextGroup)}>
					Next
				</button>
			);
		}
	},

	componentDidMount: function() {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
		PermissionsStore.addChangeListener(this.onChange);
	},

	componentWillMount: function() {
	},

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		PermissionsStore.removeChangeListener(this.onChange);
	},

	onChange: function() {
		this.setState(
			{
				user: LoginStore.user,
				group: this.state.group ? GroupStore.getGroupById(this.state.group.id) : null
			});
	},

	handleTabSelect: function(key) {
		this.setState({groupDefaultTabKey : key});
		// We aren't supposed to manipulate state directly, but it doesn't yet have the newly
		// selected tab that we want to save to local storage.
		var stateDuplicate = this.state;
		stateDuplicate.groupDefaultTabKey = key;
		Utils.LoadOrSaveState(stateDuplicate);
	},

	render: function() {
		if (this.state.group) {
			var defaultTabKey = this.state.groupDefaultTabKey ? this.state.groupDefaultTabKey : 1;
			var memberTitle = "Members (" + this.state.group.memberCount() + ")";
			return (
				<div>
					<div className="media">
						<div className="media-left">
							{this.getPreviousButton()}
						</div>
						<div className="media-body">
							<GroupInfoBox group={this.state.group} user={this.state.user} />
						</div>
						<div className="media-right">
							{this.getNextButton()}
						</div>
					</div>
					<GroupActionsBox user={this.state.user} group={this.state.group} />
					<Tabs activeKey={defaultTabKey} onSelect={this.handleTabSelect}>
						<Tab eventKey={1} title={Utils.getAnimalsTabIon()}>
							<GroupAnimalsTab group={this.state.group} user={this.state.user}/>
						</Tab>
						<Tab eventKey={2}
								title={Utils.getMembersGlyphicon(this.state.group.memberCount())}>
							<GroupMembersTab group={this.state.group} user={this.state.user}/>
						</Tab>
						<Tab eventKey={3} title={Utils.getActivityGlyphicon()}>
							<GroupActivityTab group={this.state.group} user={this.state.user}/>
						</Tab>
						<Tab eventKey={4} title={Utils.getCalendarGlyphicon()}>
							<AnimalScheduleTab group={this.state.group} view="group"/>
						</Tab>
					</Tabs>
				</div>
			);
		} else if (LoginStore.user) {
			return (
				<div>
					<h1>
						You are not part of any volunteer groups.  To get started&nbsp;
					<Link to="searchPage">search</Link>
						&nbsp;for a group to join, or&nbsp;
					<Link to="addNewGroup">add</Link> a new one.
					</h1>
				</div>
			);
		} else {
			return (
			<div>
				<h1>To get started&nbsp;
				<Link to="searchPage">search</Link>
					&nbsp;for a group, or <Link to="loginPage">log in</Link> to join or add one.
				</h1>
			</div>
		);
		}
	}
});

module.exports = GroupHomePage;
