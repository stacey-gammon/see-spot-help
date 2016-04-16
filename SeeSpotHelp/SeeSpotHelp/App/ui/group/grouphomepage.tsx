"use strict";

var React = require("react");
/* eslint-disable no-unused-vars */
var Link = require("react-router").Link;
var ReactBootstrap = require("react-bootstrap");
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;

var Intro = require("../intro");
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
import StoreStateHelper from '../../stores/storestatehelper';

var GroupHomePage = React.createClass({
	getInitialState: function() {
		var isSearchResult = Utils.FindPassedInProperty(this, 'isSearchResult');
		var groupId = Utils.FindPassedInProperty(this, 'groupId');
		var state = {
			fromSearch: isSearchResult,
			groupDefaultTabKey: null,
			groupId: groupId
		};
		Utils.LoadOrSaveState(state);
		return state;
	},

	loadFromServer: function () {
		var groupId = this.state.groupId;
		// If the user doesn't have any 'last looked at' group, see if we can grab one from the user.
		if (!groupId && LoginStore.getUser()) {
			var groups = GroupStore.getGroupsByUser(LoginStore.getUser());
			if (groups && groups.length > 0) {
				groupId = groups[0].id;
			}
		}

		// User doesn't belong to any groups, and isn't look at any.  We'll just show an intro
		// screen.
		if (!groupId) return;

		var promises = [];
		promises.push(LoginStore.ensureUser());
		promises.push(GroupStore.ensureItemById(groupId));

		Promise.all(promises).then(
			function () {
				console.log('promises all resolved.');
				var group = GroupStore.getGroupById(groupId);
				var permission = StoreStateHelper.GetPermission(this.state);
				if (group) {
					Utils.SaveProp('groupId', group.id);
					if (this.isMounted()) { this.setState({ permission: permission }); }
					this.addChangeListeners();
				}
			}.bind(this)
		);
	},

	loadDifferentGroup: function(group) {
		this.setState({ groupId: group.id });
	},

	getPreviousButton: function() {
		if (this.state.fromSearch || !LoginStore.getUser()) return null;
		var usersGroups = GroupStore.getGroupsByUser(LoginStore.getUser());
		if (!usersGroups) return null;

		var previousGroup = null;
		for (var i = 0; i < usersGroups.length; i++) {
			if (usersGroups[i].id == this.state.groupId) {
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
			if (usersGroups[i].id == this.state.groupId) {
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

	addChangeListeners: function () {
		StoreStateHelper.AddChangeListeners([LoginStore, GroupStore, PermissionsStore], this);
	},

	componentWillMount: function() {
		this.loadFromServer();
	},

	componentWillUnmount: function() {
		StoreStateHelper.RemoveChangeListeners([LoginStore, GroupStore, PermissionsStore], this);
	},

	onChange: function() {
		var permission = StoreStateHelper.GetPermission(this.state);
		this.setState({ permission: permission });
	},

	handleTabSelect: function(key) {
		this.setState({groupDefaultTabKey : key});
		// We aren't supposed to manipulate state directly, but it doesn't yet have the newly
		// selected tab that we want to save to local storage.
		var stateDuplicate = this.state;
		stateDuplicate.groupDefaultTabKey = key;
		Utils.LoadOrSaveState(stateDuplicate);
	},

	hasGroupHomePage: function(group) {
		var permission = StoreStateHelper.GetPermission(this.state);
		var defaultTabKey = this.state.groupDefaultTabKey ? this.state.groupDefaultTabKey : 1;
		var memberTitle = "Members (" + group.memberCount() + ")";
		return (
			<div>
				<div className="media">
					<div className="media-left">
						{this.getPreviousButton()}
					</div>
					<div className="media-body">
						<GroupInfoBox group={group} user={LoginStore.getUser()} />
					</div>
					<div className="media-right">
						{this.getNextButton()}
					</div>
				</div>
				<GroupActionsBox user={LoginStore.getUser()} group={group} />
				<Tabs activeKey={defaultTabKey} onSelect={this.handleTabSelect}>
					<Tab eventKey={1} title={Utils.getAnimalsTabIon()}>
						<GroupAnimalsTab group={group} permission={permission}/>
					</Tab>
					<Tab eventKey={2} title={Utils.getMembersGlyphicon(group.memberCount())}>
						<GroupMembersTab group={group}/>
					</Tab>
					<Tab eventKey={3} title={Utils.getActivityGlyphicon()}>
						<GroupActivityTab group={group} user={LoginStore.getUser()}/>
					</Tab>
					<Tab eventKey={4} title={Utils.getCalendarGlyphicon()}>
						<GroupScheduleTab group={group} view="group" permission={permission}/>
					</Tab>
				</Tabs>
			</div>
		);
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

		if (this.state.groupId) {
			var group = GroupStore.getGroupById(this.state.groupId);
			if (group) { return this.hasGroupHomePage(group); }
		}

		return ( <div> <Intro /> </div> );
}
});

module.exports = GroupHomePage;
