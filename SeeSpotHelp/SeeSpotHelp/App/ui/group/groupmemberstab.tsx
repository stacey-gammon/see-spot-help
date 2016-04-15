"use strict"

var React = require("react");
var Link = require("react-router").Link;
var MemberListItem = require("../person/memberlistitem");
var SearchBox = require("../searchbox");
var GroupInfoBox = require("./groupinfobox");
var GroupActionsBox = require("./groupactionsbox");

import Volunteer from '../../core/volunteer';
import Permission from '../../core/permission';
import VolunteerGroup from '../../core/volunteergroup';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import VolunteerStore from '../../stores/volunteerstore';
import PermissionsStore from '../../stores/permissionsstore';
import DataServices from '../../core/dataservices';

var GroupMembersTab = React.createClass({
	getInitialState: function () {
		var group = this.props.location &&
					this.props.location.state &&
					this.props.location.state.group ||
					this.props.group;
		var permission = LoginStore.getUser() && group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, group.id) :
			Permission.CreateNonMemberPermission();
		return {
			user: LoginStore.getUser(),
			group: group,
			permission: permission
		}
	},

	componentWillReceiveProps: function(nextProps) {
		console.log('componentWillReceiveProps');
		var permission = this.getPermission(nextProps.group);
		this.setState({
			group: nextProps.group,
			permission: permission
		});
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onLoginChange);
		GroupStore.addChangeListener(this.onChange);
		VolunteerStore.addChangeListener(this.onChange);
		PermissionsStore.addChangeListener(this.onPermissionChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onLoginChange);
		GroupStore.removeChangeListener(this.onChange);
		VolunteerStore.removeChangeListener(this.onChange);
		PermissionsStore.removeChangeListener(this.onPermissionChange);
	},

	onLoginChange: function () {
		console.log('onLoginChange');
		this.onPermissionChange();
	},

	getPermission: function (group) {
		console.log('getPermission');
		return LoginStore.getUser() && group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, group.id) :
			Permission.CreateNonMemberPermission();
	},

	onPermissionChange: function () {
		console.log('onPermissionChange');
		this.setState(
			{
				permission: this.getPermission(this.state.group)
			});
	},

	onChange: function () {
		console.log('onChange');
		var newGroup = this.state.group ? GroupStore.getGroupById(this.state.group.id) : null;
		var group = newGroup ? newGroup : group;
		this.setState(
			{
				group: group,
				permission: this.getPermission(group)
			});
	},

	generateMember: function (member) {
		return (
			<MemberListItem user={LoginStore.getUser()} member={member} group={this.state.group }/>
		);
	},

	render: function () {
		var members = [];
		var memberPermissions = PermissionsStore.getPermissionsByGroupId(this.props.group.id);
		if (!memberPermissions) return null;
		for (var i = 0; i < memberPermissions.length; i++) {
			var permission = memberPermissions[i];
			// VolunteerStore will handle downloading any user data we don't currently have
			// locally and will refresh this element in that case.
			var member = VolunteerStore.getVolunteerById(permission.userId);
			if (member && !permission.notInGroup()) {
				members.push(this.generateMember(member));
			}
		}
		return (
			<div className="list-group">
				{members}
			</div>
		);
	}
});

module.exports = GroupMembersTab;
