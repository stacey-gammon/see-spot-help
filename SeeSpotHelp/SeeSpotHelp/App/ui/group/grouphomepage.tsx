"use strict";

var React = require("react");
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
					this.addChangeListeners(group);
				}
			}.bind(this)
		);
	},

	loadDifferentGroup: function(group) {
		this.setState({ groupId: group.id });
	},

	addChangeListeners: function (group) {
		PermissionsStore.addPropertyListener(this, 'groupId', group.id, this.onChange.bind(this));
		StoreStateHelper.AddChangeListeners([LoginStore, GroupStore], this);
	},

	componentWillMount: function() {
		this.loadFromServer();
	},

	componentWillUnmount: function() {
		StoreStateHelper.RemoveChangeListeners([LoginStore, GroupStore], this);
		PermissionsStore.removePropertyListener(this);
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

	getMembersTabTitle: function (group) {
		if (!group) return null;
		var permissions = PermissionsStore.getPermissionsByGroupId(group.id);
		if (permissions) {
			var count = 0;
			for (var i = 0; i < permissions.length; i++) {
				if (permissions[i].inGroup()) {
					count++;
				}
			}
			return Utils.getMembersGlyphicon(count);
		}
		return null;
	},

	hasGroupHomePage: function(group) {
		var permission = StoreStateHelper.GetPermission(this.state);
		var defaultTabKey = this.state.groupDefaultTabKey ? this.state.groupDefaultTabKey : 1;
		return (
			<div className="page">
				<div className="info-top">
					<div className="media">
						<div className="media-left">
						</div>
						<div className="media-body">
							<GroupInfoBox group={group} permission={permission} />
						</div>
						<div className="media-right">
						</div>
					</div>
					<GroupActionsBox user={LoginStore.getUser()} group={group} />
				</div>
				<Tabs className="tabs-area" activeKey={defaultTabKey} onSelect={this.handleTabSelect}>
					<Tab className="tab" eventKey={1} title={Utils.getAnimalsTabIon()}>
						<GroupAnimalsTab group={group} permission={permission}/>
					</Tab>
					<Tab className="tab" ref="groupMembersTab" eventKey={2}
						title={this.getMembersTabTitle(group)}>
						<GroupMembersTab group={group} permission={permission}/>
					</Tab>
					<Tab className="tab" eventKey={3} title={Utils.getActivityGlyphicon()}>
						<GroupActivityTab group={group} user={LoginStore.getUser()}/>
					</Tab>
					<Tab className="tab" eventKey={4} title={Utils.getCalendarGlyphicon()}>
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
