'use strict'

var React = require('react');

import LoginStore = require("../../stores/loginstore");
import GroupStore = require("../../stores/groupstore");
import PermissionsStore = require("../../stores/permissionsstore");
import VolunteerGroup = require("../../core/volunteergroup");
import Permission = require("../../core/permission");

var GroupInfoBox = React.createClass({
	getInitialState: function() {
		var member = this.props.member
		var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;
		var permission = member && group ?
			PermissionsStore.getPermission(member.id, group.id) : null;
		return {
			member: member,
			group: group,
			permission: permission
		};
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
		PermissionsStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		PermissionsStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		var group = this.state.group ?
			GroupStore.getGroupById(this.state.group.id) : null;
		var permission = LoginStore.getUser() && group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, group.id) :
			Permission.CreateNonMemberPermission();
		this.setState(
			{
				group: group,
				permission: permission
			});
	},

	editGroup: function() {
		this.context.router.push(
			{
				pathname: "/addNewGroup",
				state: {
					group:  this.props.group,
					mode: 'edit'
				}
			});
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	getEditButton: function() {
		if (!LoginStore.getUser() ||
			!this.state.permission||
			!this.state.permission.admin()) {
			return null;
		}

		return (
				<span style={{marginLeft: 10 + 'px'}}
					onClick={this.editGroup}
					className="glyphicon glyphicon-edit">
				</span>
		);
	},

	render: function() {
		console.log("GroupInfoBox:render");
		return (
			<div className="shelterInfoBox">
				<h1>{this.props.group.name}{this.getEditButton()}</h1>
				<h2>{this.props.group.shelter}</h2>
				<h2>{this.props.group.address}</h2>
				<h2>{this.props.group.city}, {this.props.group.state} {this.props.group.zipCode}</h2>
			</div>
		);
	}
});

module.exports = GroupInfoBox;
