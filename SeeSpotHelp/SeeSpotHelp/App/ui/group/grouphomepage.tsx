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
var GroupScheduleTab = require("./groupscheduletab");
/* eslint-enable no-unused-vars */

import Utils from '../../core/utils';
import VolunteerGroup from '../../core/volunteergroup';
import Permission from '../../core/permission';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import PermissionsStore from '../../stores/permissionsstore';

var GroupHomePage = React.createClass({
	getInitialState: function() {
		var group = Utils.FindPassedInProperty(this, 'group');
		if (group) group = VolunteerGroup.castObject(group);

		var isSearchResult = Utils.FindPassedInProperty(this, 'isSearchResult');

		// Undefined will mess up LoadOrSaveState so make sure we explicitly have false.
		isSearchResult = isSearchResult ? true : false;
		var state = {
			group: group,
			fromSearch: isSearchResult,
			groupDefaultTabKey: null,
			permission: null
		};

		Utils.LoadOrSaveState(state);

		// Don't load the permission from session storage.

		var permission = LoginStore.getUser() && state.group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, state.group.id) :
			Permission.CreateNonMemberPermission();
		state.permission = permission;

		// If the user doesn't have any 'last looked at' group, and nothing has been set,
		// see if we can grab one from the user.
		if (!state.group && LoginStore.getUser()) {
			var groups = GroupStore.getGroupsByUser(LoginStore.getUser());
			if (groups && groups.length > 0) {
				state.group = groups[0];

				var permission = LoginStore.getUser() && state.group ?
					PermissionsStore.getPermission(LoginStore.getUser().id, state.group.id) :
					Permission.CreateNonMemberPermission();
				state.permission = permission;

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
		if (this.state.fromSearch || !LoginStore.getUser()) return null;
		var usersGroups = GroupStore.getGroupsByUser(LoginStore.getUser());
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
		if (this.state.fromSearch || !LoginStore.getUser()) return null;
		var usersGroups = GroupStore.getGroupsByUser(LoginStore.getUser());
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

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		PermissionsStore.removeChangeListener(this.onChange);
	},

	onChange: function() {
		var group = this.state.group ? GroupStore.getGroupById(this.state.group.id) : null;

		var permission = LoginStore.getUser() && group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, group.id) :
			Permission.CreateNonMemberPermission();

		// We triggered a download, we'll get back here again once it's complete, with fresh data.
		if (!group && this.state.group) group = this.state.group;
		this.setState(
			{
				group: group,
				permission: permission
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
		if (PermissionsStore.hasError || LoginStore.hasError || GroupStore.hasError) {
			var message = PermissionsStore.errorMessage ||
				LoginStore.errorMessage ||
				GroupStore.errorMessage;
			return (
				<div className='alert alert-danger'> {message} </div>
			);
		}

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
							<GroupInfoBox group={this.state.group} user={LoginStore.getUser()} />
						</div>
						<div className="media-right">
							{this.getNextButton()}
						</div>
					</div>
					<GroupActionsBox user={LoginStore.getUser()} group={this.state.group} />
					<Tabs activeKey={defaultTabKey} onSelect={this.handleTabSelect}>
						<Tab eventKey={1} title={Utils.getAnimalsTabIon()}>
							<GroupAnimalsTab
								group={this.state.group}
								permission={this.state.permission}/>
						</Tab>
						<Tab eventKey={2}
								title={Utils.getMembersGlyphicon(this.state.group.memberCount())}>
							<GroupMembersTab group={this.state.group}/>
						</Tab>
						<Tab eventKey={3} title={Utils.getActivityGlyphicon()}>
							<GroupActivityTab group={this.state.group} user={LoginStore.getUser()}/>
						</Tab>
						<Tab eventKey={4} title={Utils.getCalendarGlyphicon()}>
							<GroupScheduleTab
								group={this.state.group}
								view="group"
								permission={this.state.permission}/>
						</Tab>
					</Tabs>
				</div>
			);
		} else if (LoginStore.getUser()) {
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
